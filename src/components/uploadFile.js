const uploadFile = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        console.log(formData);

        const response = await fetch('http://localhost:8000/file/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Nahrávání souboru selhalo');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Nahrávání souboru selhalo: ', error);
        throw error;
    }
};

const getFileUrl = (fileName) => {
    //v základu jsme v /public/ pro webový vývoj
    //return `${window.location.origin}/uploads/${fileName}`;

    //pro electron
    return `../../../public/uploads/${fileName}`;
};

export { uploadFile, getFileUrl };