const MemberAvatar = ({ name, role }) => {
  return (
    <div className="member-item">
      <div className="avatar small">{name[0]}</div>
      <div className="member-info">
        <span className="member-name">{name}</span>
        <span className="member-role">{role}</span>
      </div>
    </div>
  );
};

const MembersPanel = () => {
  return (
    <>
      <div className="section-header">
        <h3>Members</h3>
        <span className="muted">›</span>
      </div>

      <div className="members-row">
        <MemberAvatar name="Scarlett" role="Admin" />
        <MemberAvatar name="Narlya" role="Full Access" />
        <MemberAvatar name="Riya" role="Full Access" />
        <MemberAvatar name="Dad" role="Full Access" />
        <MemberAvatar name="Mom" role="Full Access" />
      </div>
    </>
  );
};

export default MembersPanel;
