import { useState } from 'react';
import NextImage from 'next/image';
export default function Home() {
  const [file, setFile] = useState(null);

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      setFile(event.target.result);
    };

    reader.readAsDataURL(selectedFile);
  };
  const cercevePath = '/cerceve.png';

  const onUpload = async () => {
    const response = await fetch('/api/applyFrame', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file })
    });

    // İşlenen resmi indir
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'islenmis-resim.png';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };
  return (
    <div className="container">
      <header className="text-center mt-5">
        <h1>Cumhuriyetin 100. Yılı Özel Çerçevesi</h1>
        <p>Cumhuriyetin 100. yılını kutlamak için görselinize özel bir çerçeve ekleyin!</p>
      </header>
      <div className="mt-5 text-center">
        <input type="file" onChange={onFileChange} className="mb-3" />
        {file && <button onClick={onUpload} className="btn btn-primary">Görseli İndir</button>}

        <div className="mt-3">
          <h5>Örnek Çerçeve:</h5>
          <NextImage width={350} height={350} src={cercevePath} alt="Örnek Çerçeve" className="img-fluid" />
        </div>
      </div>
      <footer className="text-center mt-5">
        <p>100 yılın gururunu ve coşkusunu görsellerinizle paylaşın.</p>
      </footer>
    </div>
  );
}
