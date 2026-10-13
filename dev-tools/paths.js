// Shared paths for the verification scripts (they compare this project with backup/Datapath-original.html).
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..'), BACKUP_DIR=path.join(ROOT,'backup'), BACKUP_FILE='Datapath-original.html';
const backupHtml=()=>fs.readFileSync(path.join(BACKUP_DIR,BACKUP_FILE),'utf8');
const origScript=()=>{ const h=backupHtml(); return h.slice(h.indexOf('<script>')+8,h.lastIndexOf('</script>')); };
module.exports={ROOT,BACKUP_DIR,BACKUP_FILE,backupHtml,origScript};
