import Button from "../../component/Button/Button";
import Header from "../../component/Header/Header";
import "./Profile.css";
export default function Profile() {
  return (
    <>
      <div style={{ height: "100px" }}>
        <Header />
      </div>
      <div id="profile">
        <section className="main">
          <h1>Account Settings</h1>
          <p>
            Manage your personal information, security preferences, and account
            status.
          </p>
          <div className="personInfo">
            <i class="fa-solid fa-user"></i>
            <h3>Personal Information</h3>
          </div>
          <hr />
          <div className="secure">
            <div className="profile-input-group">
              <label htmlFor="name">Username</label>
              <input id="name" name="name" type="text" placeholder="John Doe" />
            </div>
            <div className="profile-input-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
              />
            </div>
            <Button>Save Changes</Button>
          </div>
          <div className="personInfo">
            <i class="fa-solid fa-shield-halved"></i>
            <h3>Security</h3>
          </div>
          <hr />
          <div className="secure">
            <div className="changePassword">
              <div className="profile-input-group">
                <label>Old Password</label>
                <input htmlFor="pwd" type="password" placeholder="••••••••" />
                <span id="pwd" name="pwd" className="profile-input-hint">
                  Must be at least 8 characters
                </span>
              </div>
              <div className="profile-input-group">
                <label>New Password</label>
                <input htmlFor="pwd" type="password" placeholder="••••••••" />
                <span id="pwd" name="pwd" className="profile-input-hint">
                  Must be at least 8 characters
                </span>
              </div>
            </div>
            <div className="updatePass">
              <p>Update your password regularly to keep your account secure.</p>
              <Button>Update Password</Button>
            </div>
          </div>
          <hr />
          <div className="logOut">
            <Button>Delete Account</Button>
            <Button>
              Log Out<i class="fa-solid fa-right-from-bracket"></i>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}