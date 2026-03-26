import React, { useEffect, useRef, useState } from "react";

const HlsPlayer = () => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null); // keep reference to destroy later
  const [url, setUrl] = useState("");

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !url) return;
    console.log(video.canPlayType('application/vnd.apple.mpegurl')
    ? "Native HLS"
    : "hls.js");
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    console.log("START");

    // ✅ iOS / Safari native HLS support
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      console.log("NATIVE HLS");
      
      video.src = url;
      video.load();
      return;
    }

    // ✅ Fallback to hls.js for other browsers
    import("hls.js").then((HlsModule) => {
      console.log("HLS");
      
      const Hls = HlsModule.default;

      if (Hls.isSupported()) {
        const hls = new Hls({
          liveSyncDuration:1,
        liveMaxLatencyDuration:3,
        autoStartLoad:false,
        manifestLoadingMaxRetry:1,
        manifestLoadingTimeOut:8000,
        manifestLoadingRetryDelay: 1000
        });

        hls.loadSource(url);
        hls.attachMedia(video);

        hlsRef.current = hls;
      } else {
        console.warn("HLS not supported in this browser");
      }
    });

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [url]);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>DU Sample HLS Player</h2>

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
        playsInline // ✅ important for iOS
        style={{ width: "100%", background: "#000", height: "360px" }}
      />
    </div>
  );
};

export default HlsPlayer;