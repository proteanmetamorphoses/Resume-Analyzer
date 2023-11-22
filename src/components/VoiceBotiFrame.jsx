import "./VoiceBotiFrame.css";
const VoiceBotIframe = () => {
  return (
    <div id="wrap">
      <iframe id="theBot"
        src="https://www.ispeakwell.ca"
        title="VoiceBot"
        allow="microphone"
      ></iframe>
    </div>
  );
};

export default VoiceBotIframe;