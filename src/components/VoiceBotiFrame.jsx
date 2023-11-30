import "./VoiceBotiFrame.css";
const VoiceBotIframe = () => {
  return (
    <div id="wrap">
      <iframe id="theBot"
        src={`https://www.ispeakwell.ca/?version=${new Date().getTime()}`}
        title="VoiceBot"
        allow="microphone"
      ></iframe>
    </div>
  );
};

export default VoiceBotIframe;