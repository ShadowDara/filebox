import { h } from 'preact';
import { useState } from 'preact/hooks';
import './style.css';
import { pagelink } from '../..';

import CopyButton from '../../components/CopyButton';

export function Home() {
	let upload = false;

	const [file, setFile] = useState(null);
	const [expiration, setExpiration] = useState({
		days: '0',
		hours: '3',
		minutes: '0',
		seconds: '0'
	});
	const [uploading, setUploading] = useState(false);
	const [message, setMessage] = useState('');
	const [uploadSuccess, setUploadSuccess] = useState(false);
	const [downloadLink, setDownloadLink] = useState('');

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
		setMessage('');
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setExpiration((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!file) return setMessage('Please select a file first.');

		const formData = new FormData();
		formData.append('file', file);
		formData.append('d', expiration.days);
		formData.append('h', expiration.hours);
		formData.append('m', expiration.minutes);
		formData.append('s', expiration.seconds);

		setUploading(true);
		try {
			const res = await fetch('/api/uploads', {
				method: 'POST',
				body: formData
			});

			if (!res.ok) throw new Error('Error while uploading');

			const result = await res.json();

			const baseUrl = await pagelink(); // host + port
			const downloadUrl = `${baseUrl}/uploads/${result.sha_checksum}/${result.filename}`;

			setMessage(`Uploaded: ${result.filename || 'File'}`);
			setDownloadLink(downloadUrl);
			setUploadSuccess(true);
		} catch (err) {
			setMessage('Upload did not work :(');
			console.error(err);
		} finally {
			setUploading(false);
		}

	};

	return (
		<div className="upload-wrapper">
			<form onSubmit={handleSubmit} className="upload-box" encType="multipart/form-data">
				<h1>🚀 Upload file</h1>

				<label className="drop-area">
					{file ? `📄 ${file.name}` : 'Choose File'}
					<input type="file" name="file" onChange={handleFileChange} required />
				</label>

				<div className="expires">
					<p>⏳ Expiration Date</p>
					<div className="expire-fields">
						<input
							type="number"
							name="days"
							placeholder="Tage"
							value={expiration.days}
							onChange={handleChange}
							min="0"
						/>
						<input
							type="number"
							name="hours"
							placeholder="Stunden"
							value={expiration.hours}
							onChange={handleChange}
							min="0"
							max="23"
						/>
						<input
							type="number"
							name="minutes"
							placeholder="Minuten"
							value={expiration.minutes}
							onChange={handleChange}
							min="0"
							max="59"
						/>
						<input
							type="number"
							name="seconds"
							placeholder="Sekunden"
							value={expiration.seconds}
							onChange={handleChange}
							min="0"
							max="59"
						/>
					</div>
				</div>

				<button type="submit" disabled={uploading}>
					{uploading ? 'Uploading ...' : 'Upload File'}
				</button>

				{message && <p className="message">{message}</p>}

				{uploadSuccess && (
					<div className="copy-section">
						<CopyButton textToCopy={downloadLink} linktext={"Copy Link"} linktext2={"Link copyied!"} />
					</div>
				)}
			</form>
		</div>
	);
}
