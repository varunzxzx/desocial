const PROFILE_PICS = [
  require("../assets/samples/profile/elliot.jpg"),
  require("../assets/samples/profile/joe.jpg"),
  require("../assets/samples/profile/matt.jpg"),
  require("../assets/samples/profile/matthew.png"),
];

function getProfilePic() {
  return PROFILE_PICS[Math.floor(Math.random() * 4)];
}

export default getProfilePic;
