const execSync = require("child_process").execSync;
const fs = require('fs');



var load_rdp_servers_subkeys = () => {
    var subkeys = execSync('reg query "HKCU\\Software\\Microsoft\\Terminal Server Client\\Servers"').toString();

    subkeys = subkeys.trim();
    if (subkeys.length > 0) {
        return subkeys.split('\r\n');
    }
    return []
};


var delete_rdp_history= subkeys => {
    if (subkeys.length > 0) {
        // reg clear
        // delete registry keys in "HKCU\\Software\\Microsoft\\Terminal Server Client\\Default"
        execSync('reg delete "HKCU\\Software\\Microsoft\\Terminal Server Client\\Default" /va /f');
        
        // delete registry subkeys in "HKCU\\Software\\Microsoft\\Terminal Server Client\\Servers\\"
        subkeys.forEach(subkey => {
            execSync(`reg delete "${subkey}" /f`);
        });
    }

    // if default.rdp file is existed in Documents Directory, delete default.rdp file
    var default_rdp_file_path = "%USERPROFILE%\\Documents\\Default.rdp";
    if (fs.existsSync(default_rdp_file_path)) {
        execSync(`DEL /F /Q /A "${default_rdp_file_path}"`);
    }
    
    
};

var rdp_histories = load_rdp_servers_subkeys();
delete_rdp_history(rdp_histories)