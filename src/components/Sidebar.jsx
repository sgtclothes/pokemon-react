/* eslint-disable react/prop-types */

const Sidebar = ({ isOpen, sidebarItems, isAdmin }) => {
  return (
    <div className={`sidebar ${isOpen && isAdmin ? "open" : "closed"}`}>
      <ul>
        {sidebarItems
          ? sidebarItems.map((item, index) => <li key={index}>{item.name}</li>)
          : ""}
      </ul>
    </div>
  );
};

export default Sidebar;
