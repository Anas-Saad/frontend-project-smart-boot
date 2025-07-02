import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { createWriteStream } from 'fs';
import archiver from 'archiver';

const execAsync = promisify(exec);

class BackupService {
  constructor() {
    this.backupDir = process.env.BACKUP_DIR || './backups';
    this.mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/qline-ai';
  }

  // Create full system backup
  async createFullBackup() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupId = `backup_${timestamp}`;
      const backupPath = path.join(this.backupDir, backupId);

      // Ensure backup directory exists
      await fs.mkdir(backupPath, { recursive: true });

      // Backup database
      await this.backupDatabase(backupPath);

      // Backup uploaded files
      await this.backupFiles(backupPath);

      // Create compressed archive
      const archivePath = await this.createArchive(backupPath, `${backupId}.tar.gz`);

      // Clean up temporary directory
      await fs.rmdir(backupPath, { recursive: true });

      return {
        backupId,
        archivePath,
        timestamp: new Date(),
        size: await this.getFileSize(archivePath)
      };

    } catch (error) {
      console.error('Full backup error:', error);
      throw new Error('Failed to create full backup');
    }
  }

  // Backup database
  async backupDatabase(backupPath) {
    try {
      const dbBackupPath = path.join(backupPath, 'database');
      await fs.mkdir(dbBackupPath, { recursive: true });

      // Use mongodump to backup database
      const command = `mongodump --uri="${this.mongoUri}" --out="${dbBackupPath}"`;
      await execAsync(command);

      console.log('Database backup completed');

    } catch (error) {
      console.error('Database backup error:', error);
      throw new Error('Failed to backup database');
    }
  }

  // Backup uploaded files
  async backupFiles(backupPath) {
    try {
      const filesBackupPath = path.join(backupPath, 'files');
      await fs.mkdir(filesBackupPath, { recursive: true });

      // Copy uploads directory if it exists
      const uploadsDir = './uploads';
      try {
        await fs.access(uploadsDir);
        await this.copyDirectory(uploadsDir, path.join(filesBackupPath, 'uploads'));
      } catch (error) {
        console.log('No uploads directory found, skipping file backup');
      }

      console.log('Files backup completed');

    } catch (error) {
      console.error('Files backup error:', error);
      throw new Error('Failed to backup files');
    }
  }

  // Create compressed archive
  async createArchive(sourceDir, archiveName) {
    return new Promise((resolve, reject) => {
      const archivePath = path.join(this.backupDir, archiveName);
      const output = createWriteStream(archivePath);
      const archive = archiver('tar', { gzip: true });

      output.on('close', () => {
        console.log(`Archive created: ${archivePath} (${archive.pointer()} bytes)`);
        resolve(archivePath);
      });

      archive.on('error', (error) => {
        reject(error);
      });

      archive.pipe(output);
      archive.directory(sourceDir, false);
      archive.finalize();
    });
  }

  // Restore from backup
  async restoreFromBackup(backupPath) {
    try {
      // Extract archive
      const extractPath = path.join(this.backupDir, 'restore_temp');
      await this.extractArchive(backupPath, extractPath);

      // Restore database
      await this.restoreDatabase(path.join(extractPath, 'database'));

      // Restore files
      await this.restoreFiles(path.join(extractPath, 'files'));

      // Clean up
      await fs.rmdir(extractPath, { recursive: true });

      return {
        success: true,
        timestamp: new Date(),
        message: 'Backup restored successfully'
      };

    } catch (error) {
      console.error('Restore backup error:', error);
      throw new Error('Failed to restore backup');
    }
  }

  // Restore database
  async restoreDatabase(dbBackupPath) {
    try {
      // Use mongorestore to restore database
      const command = `mongorestore --uri="${this.mongoUri}" --drop "${dbBackupPath}"`;
      await execAsync(command);

      console.log('Database restore completed');

    } catch (error) {
      console.error('Database restore error:', error);
      throw new Error('Failed to restore database');
    }
  }

  // Restore files
  async restoreFiles(filesBackupPath) {
    try {
      const uploadsSource = path.join(filesBackupPath, 'uploads');
      const uploadsTarget = './uploads';

      try {
        await fs.access(uploadsSource);
        await this.copyDirectory(uploadsSource, uploadsTarget);
        console.log('Files restore completed');
      } catch (error) {
        console.log('No files to restore');
      }

    } catch (error) {
      console.error('Files restore error:', error);
      throw new Error('Failed to restore files');
    }
  }

  // List available backups
  async listBackups() {
    try {
      const files = await fs.readdir(this.backupDir);
      const backups = [];

      for (const file of files) {
        if (file.endsWith('.tar.gz')) {
          const filePath = path.join(this.backupDir, file);
          const stats = await fs.stat(filePath);
          
          backups.push({
            filename: file,
            path: filePath,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime
          });
        }
      }

      return backups.sort((a, b) => b.created - a.created);

    } catch (error) {
      console.error('List backups error:', error);
      return [];
    }
  }

  // Delete old backups
  async cleanupOldBackups(retentionDays = 30) {
    try {
      const backups = await this.listBackups();
      const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

      for (const backup of backups) {
        if (backup.created < cutoffDate) {
          await fs.unlink(backup.path);
          console.log(`Deleted old backup: ${backup.filename}`);
        }
      }

    } catch (error) {
      console.error('Cleanup old backups error:', error);
    }
  }

  // Utility functions
  async copyDirectory(source, destination) {
    await fs.mkdir(destination, { recursive: true });
    const entries = await fs.readdir(source, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(source, entry.name);
      const destPath = path.join(destination, entry.name);

      if (entry.isDirectory()) {
        await this.copyDirectory(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }

  async getFileSize(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return this.formatBytes(stats.size);
    } catch (error) {
      return 'Unknown';
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async extractArchive(archivePath, extractPath) {
    try {
      await fs.mkdir(extractPath, { recursive: true });
      const command = `tar -xzf "${archivePath}" -C "${extractPath}"`;
      await execAsync(command);
    } catch (error) {
      console.error('Extract archive error:', error);
      throw new Error('Failed to extract archive');
    }
  }
}

export default new BackupService();