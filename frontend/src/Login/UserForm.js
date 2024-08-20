import React from "react";

const UserForm = ({ frm, handleChange, handleSubmit, buttonText }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="firstname">First Name</label>
        <input
          type="text"
          id="firstname"
          name="firstname"
          value={frm.firstname}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="lastname">Last Name</label>
        <input
          type="text"
          id="lastname"
          name="lastname"
          value={frm.lastname}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="hostel">Hostel</label>
        <input
          type="text"
          id="hostel"
          name="hostel"
          value={frm.hostel}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="room">Room Number</label>
        <input
          type="text"
          id="room"
          name="room"
          value={frm.room}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={frm.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={frm.password}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="role">Role</label>
        <select id="role" name="role" value={frm.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button type="submit">{buttonText}</button>
    </form>
  );
};

export default UserForm;
