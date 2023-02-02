import { useState } from "react";
import FormInput from "./FormInput";

const inputs = [
  {
    id: 1,
    name: "ID",
    type: "text",
    placeholder: "Ex: 501",
    errorMessage: "Station ID should be a integer number value",
    label: "Station ID",
    pattern: "^([1-9][0-9]*)$",
    required: true,
  },
  {
    id: 2,
    name: "Nimi",
    type: "text",
    placeholder: "Ex: Hanasaari",
    errorMessage: "Nimi is not in valid format",
    label: "Nimi",
    required: true,
  },
  {
    id: 3,
    name: "Namn",
    type: "text",
    placeholder: "Ex: Hanasaari",
    errorMessage: "Namn is not in valid format",
    label: "Namn",
    required: true,
  },
  {
    id: 4,
    name: "Name",
    type: "text",
    placeholder: "Ex: Hanasaari",
    errorMessage: "Name is not in valid format",
    label: "Name",
    required: true,
  },
  {
    id: 5,
    name: "Osoite",
    type: "text",
    placeholder: "Ex: Hanasaari",
    errorMessage: "Nimi is not in valid format",
    label: "Osoite",
    required: true,
  },
  {
    id: 6,
    name: "Adress",
    type: "text",
    placeholder: "Ex: Kägelviksvägen 2",
    errorMessage: "Adress is not in valid format",
    label: "Adress",
    required: true,
  },
  {
    id: 7,
    name: "Kaupunki",
    type: "text",
    placeholder: "Ex: Espoo",
    errorMessage: "Kaupunki is not in valid format",
    label: "Kaupunki",
    required: true,
  },
  {
    id: 8,
    name: "Stad",
    type: "text",
    placeholder: "Ex: Esbo",
    errorMessage: "Stad is not in valid format",
    label: "Stad",
    required: true,
  },
  {
    id: 9,
    name: "Kapasiteet",
    type: "text",
    placeholder: "Ex: 28",
    errorMessage: "Kapasiteet should be a integer number value",
    label: "Kapasiteet",
    pattern: "^([1-9][0-9]*)$",
    required: true,
  },
];

const NewStation = () => {
  const [values, setValues] = useState({
    ID: 0,
    Nimi: "",
    Namn: "",
    Name: "",
    Osoite: "",
    Adress: "",
    Kaupunki: "",
    Stad: "",
    Kapasiteet: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("form data: ", values);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Form add a new station</h1>
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={(values as any)[input.name]}
            onChange={onChange}
          />
        ))}
        <button className="custom-btn">Submit</button>
      </form>
    </div>
  );
};

export default NewStation;
