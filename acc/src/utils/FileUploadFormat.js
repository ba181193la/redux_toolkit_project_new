export const checkFileFormat=(file)=>{
    const allowedExtensions = ["xlsx"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    return allowedExtensions.includes(fileExtension)

}