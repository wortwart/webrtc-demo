var localVideo = document.getElementById("localVideo");
var remoteVideo = document.getElementById("remoteVideo");
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
window.RTCPeerConnection = window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
navigator.getUserMedia({video: true}, gotStream, function(e) {console.error(e)});

function gotStream(stream) {
	localVideo.src = URL.createObjectURL(stream);
	var localPC = new RTCPeerConnection(null);
	var remotePC = new RTCPeerConnection(null);
	localPC.addStream(stream);
	remotePC.onaddstream = function(ev) {
		remoteVideo.src = URL.createObjectURL(ev.stream);
	}
 localPC.createOffer(function(desc) {
	 localPC.setLocalDescription(desc);
	 remotePC.setRemoteDescription(desc);
	 remotePC.createAnswer(function(desc) {
		 remotePC.setLocalDescription(desc);
		 localPC.setRemoteDescription(desc);
	 });
 });
	localPC.onicecandidate = function(ev) {
		if (ev.candidate) remotePC.addIceCandidate(new RTCIceCandidate(ev.candidate));
	};
	remotePC.onicecandidate = function(ev) {
  if (ev.candidate) localPC.addIceCandidate(new RTCIceCandidate(ev.candidate));
	}
}
