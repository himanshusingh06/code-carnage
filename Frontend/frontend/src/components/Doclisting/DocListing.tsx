import React, { useState } from "react";
import "./docListing.css";

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  image?: string;
};

const DoctorCard: React.FC<{ doctor: Doctor }> = ({ doctor }) => {
  return (
    <div className="doctor-card">
      <img
        src={doctor.image || "https://via.placeholder.com/100"}
        alt={doctor.name}
        className="doctor-image"
      />
      <div className="doctor-details">
        <h3>{doctor.name}</h3>
        <p>{doctor.specialty}</p>
      </div>
    </div>
  );
};

const DocListing: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([
    { id: 1, name: "Dr. Alice Smith", specialty: "Cardiologist" },
    { id: 2, name: "Dr. Bob Johnson", specialty: "Neurologist" },
  ]);

  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialty: "",
    image: "",
  });

  const addDoctor = () => {
    if (newDoctor.name && newDoctor.specialty) {
      setDoctors((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          name: newDoctor.name,
          specialty: newDoctor.specialty,
          image: newDoctor.image,
        },
      ]);
      setNewDoctor({ name: "", specialty: "", image: "" });
    }
  };

  return (
    <div className="doc-listing">
      <h2>Doctor Listing</h2>
      <div className="add-doctor-form">
        <input
          type="text"
          placeholder="Name"
          value={newDoctor.name}
          onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Specialty"
          value={newDoctor.specialty}
          onChange={(e) =>
            setNewDoctor({ ...newDoctor, specialty: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Image URL (optional)"
          value={newDoctor.image}
          onChange={(e) =>
            setNewDoctor({ ...newDoctor, image: e.target.value })
          }
        />
        <button onClick={addDoctor}>Add Doctor</button>
      </div>
      <div className="doctor-list">
        {doctors.map((doc) => (
          <DoctorCard key={doc.id} doctor={doc} />
        ))}
      </div>
    </div>
  );
};

export default DocListing;
