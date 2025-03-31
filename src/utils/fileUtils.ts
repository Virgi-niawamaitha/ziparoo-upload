
/**
 * Formats file size to be human readable
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Validates that a file is a ZIP file
 */
export const isZipFile = (file: File): boolean => {
  return file.name.toLowerCase().endsWith('.zip') || 
         file.type === 'application/zip' || 
         file.type === 'application/x-zip-compressed';
};

/**
 * Gets a file extension
 */
export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
};

/**
 * Determines if a file is a text file that can be displayed
 */
export const isTextFile = (filename: string): boolean => {
  const textExtensions = [
    'txt', 'md', 'json', 'js', 'jsx', 'ts', 'tsx', 'html', 'css', 'scss',
    'xml', 'svg', 'yaml', 'yml', 'sh', 'bat', 'c', 'cpp', 'java', 'py',
    'rb', 'php', 'go', 'rust', 'swift', 'kt', 'config', 'ini', 'env'
  ];
  
  const ext = getFileExtension(filename).toLowerCase();
  return textExtensions.includes(ext);
};
