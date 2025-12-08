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
        <MemberAvatar name="Linh" role="Trưởng phòng" />
        <MemberAvatar name="Binh" role="Thành viên" />
        <MemberAvatar name="Bao" role="Thành viên" />
        <MemberAvatar name="HA" role="Thành viên" />
        <MemberAvatar name="Lan" role="Thành viên" />
      </div>
    </>
  );
};

export default MembersPanel;
