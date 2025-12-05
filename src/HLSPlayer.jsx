import React, { useEffect, useRef, useState } from "react";

const HlsPlayer = () => {
  const videoRef = useRef(null);
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!url) return;

    // Load the local HLS script
    const script = document.createElement("script");
    script.src = "/hls.min.js"; // served from public/
    script.onload = () => {
      if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls();
        hls.loadSource(url);
        hls.attachMedia(videoRef.current);
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        // Safari fallback
        videoRef.current.src = url;
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [url]);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>HLS Video Player</h2>

      <input
        type="text"
        placeholder="Enter .m3u8 URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          fontSize: "16px",
        }}
      />

      <video
        ref={videoRef}
        controls
        style={{ width: "100%", background: "#000", height: "360px" }}
      ></video>
    </div>
  );
};

export default HlsPlayer;
