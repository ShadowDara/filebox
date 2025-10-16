import { h } from 'preact';
import { useState } from 'preact/hooks';
import './CopyButton.css';

export default function CopyButton({ textToCopy, linktext, linktext2 }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copying did not work:", err);
      alert("Error while copying.");
    }
  };

  return (
    <button type="button" onClick={handleCopy}>
      {copied ? linktext2 : linktext}
    </button>
  );
}
