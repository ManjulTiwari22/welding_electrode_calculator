"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import "./WeldingCalculator.css"

const WeldingCalculator = () => {
  const [vesselDiameter, setVesselDiameter] = useState("")
  const [vesselLength, setVesselLength] = useState("")
  const [vesselThickness, setVesselThickness] = useState("")
  const [longitudinalSeams, setLongitudinalSeams] = useState("")
  const [circumferentialSeams, setCircumferentialSeams] = useState("")

  const [longitudinalRootGap, setLongitudinalRootGap] = useState("")
  const [longitudinalBevelAngle, setLongitudinalBevelAngle] = useState("")
  const [longitudinalRootFace, setLongitudinalRootFace] = useState("")
  const [longitudinalWeldType, setLongitudinalWeldType] = useState("Single V")
  const [longitudinalRadius, setLongitudinalRadius] = useState("")

  const [circumferentialRootGap, setCircumferentialRootGap] = useState("")
  const [circumferentialBevelAngle, setCircumferentialBevelAngle] = useState("")
  const [circumferentialRootFace, setCircumferentialRootFace] = useState("")
  const [circumferentialWeldType, setCircumferentialWeldType] = useState("Single V")
  const [circumferentialRadius, setCircumferentialRadius] = useState("")

  const [nozzleRootGap, setNozzleRootGap] = useState("")
  const [nozzleBevelAngle, setNozzleBevelAngle] = useState("")
  const [nozzleRootFace, setNozzleRootFace] = useState("")
  const [nozzleWeldType, setNozzleWeldType] = useState("Single V")
  const [nozzleRadius, setNozzleRadius] = useState("")

  const [isFormValid, setIsFormValid] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState("")

  const [nozzleSize, setNozzleSize] = useState("")
  const [nozzleQuantity, setNozzleQuantity] = useState("")
  const [nozzles, setNozzles] = useState<Nozzle[]>([])

  const [longitudinalFilletSize, setLongitudinalFilletSize] = useState("")
  const [circumferentialFilletSize, setCircumferentialFilletSize] = useState("")
  const [nozzleFilletSize, setNozzleFilletSize] = useState("")

  const removeSpaces = (str: string): string => str.replace(/\s+/g, "")
  const weldTypes = ["Single V", "Double V", "'J'Groove", "Fillet"]
  const materials = [
    "IS 2062 GR.B",
    "SA 516 GR.60",
    "SA 516 GR.65",
    "SA 516 GR.70",
    "SA 387 GR11 CL2",
    "SA537 CL-1",
    "SA 240 GR.304",
    "SA 240 GR.304L",
    "SA 240 GR.316",
    "SA 240 GR.316L",
    "SA 240 GR.317L",
    "SA 240 GR.321",
    "SA 240 UNS 32205",
    "SA 240 UNS 31803",
    "SB424  UNS NO8825",
    "SA 240 UNS 32750",
    "SB 127 UNS N04400",
    "SB 168 UNS N06600",
  ]
  const navigate = useNavigate()

  useEffect(() => {
    // Form validation logic
    const isValid =
      vesselDiameter &&
      vesselLength &&
      vesselThickness &&
      longitudinalSeams &&
      circumferentialSeams &&
      longitudinalRootGap &&
      longitudinalBevelAngle &&
      longitudinalRootFace &&
      circumferentialRootGap &&
      circumferentialBevelAngle &&
      circumferentialRootFace &&
      nozzleRootGap &&
      nozzleBevelAngle &&
      nozzleRootFace &&
      selectedMaterial &&
      nozzles.length > 0 &&
      (!longitudinalWeldType.includes("Fillet") || longitudinalFilletSize) &&
      (!circumferentialWeldType.includes("Fillet") || circumferentialFilletSize) &&
      (!nozzleWeldType.includes("Fillet") || nozzleFilletSize)
    setIsFormValid(!!isValid)
  }, [
    vesselDiameter,
    vesselLength,
    vesselThickness,
    longitudinalSeams,
    circumferentialSeams,
    longitudinalRootGap,
    longitudinalBevelAngle,
    longitudinalRootFace,
    circumferentialRootGap,
    circumferentialBevelAngle,
    circumferentialRootFace,
    nozzleRootGap,
    nozzleBevelAngle,
    nozzleRootFace,
    selectedMaterial,
    nozzles,
    longitudinalFilletSize,
    circumferentialFilletSize,
    nozzleFilletSize,
    longitudinalWeldType,
    circumferentialWeldType,
    nozzleWeldType,
  ])

  interface Nozzle {
    size: string;
    quantity: string;
  }

  interface FormData {
    vesselDiameter: string;
    vesselLength: string;
    vesselThickness: string;
    longitudinalSeams: string;
    circumferentialSeams: string;
    longitudinalRootGap: string;
    longitudinalBevelAngle: string;
    longitudinalRootFace: string;
    longitudinalWeldType: string;
    circumferentialRootGap: string;
    circumferentialBevelAngle: string;
    circumferentialRootFace: string;
    circumferentialWeldType: string;
    nozzleRootGap: string;
    nozzleBevelAngle: string;
    nozzleRootFace: string;
    nozzleWeldType: string;
    selectedMaterial: string;
    nozzles: Nozzle[];
    longitudinalRadius: string;
    circumferentialRadius: string;
    nozzleRadius: string;
    longitudinalFilletSize: string;
    circumferentialFilletSize: string;
    nozzleFilletSize: string;
  }

  const handleCalculate = (isFormValid: boolean) => {
    if (isFormValid) {
      toast.error("Please fill out all fields before proceeding.")
      return
    }
    const formData: FormData = {
      vesselDiameter,
      vesselLength,
      vesselThickness,
      longitudinalSeams,
      circumferentialSeams,
      longitudinalRootGap,
      longitudinalBevelAngle,
      longitudinalRootFace,
      longitudinalWeldType,
      circumferentialRootGap,
      circumferentialBevelAngle,
      circumferentialRootFace,
      circumferentialWeldType,
      nozzleRootGap,
      nozzleBevelAngle,
      nozzleRootFace,
      nozzleWeldType,
      selectedMaterial,
      nozzles,
      longitudinalRadius,
      circumferentialRadius,
      nozzleRadius,
      longitudinalFilletSize,
      circumferentialFilletSize,
      nozzleFilletSize,
    }
    navigate("/calculatorResult", { state: { formData } })
    console.log(formData, "formdata")
  }

  interface WeldDiagramProps {
    weldType: string;
    sectionTitle: string;
  }

  const renderWeldDiagram = ({ weldType, sectionTitle }: WeldDiagramProps) => {
    let imageName = removeSpaces(weldType)
    imageName = imageName + ".svg"
    return (
      <div className="weld-diagram">
        <img src={`/${imageName}`} alt={`${weldType} Diagram`} />
      </div>
    )
  }

  const handleAddNozzle = () => {
    if (nozzleSize && nozzleQuantity) {
      setNozzles([...nozzles, { size: nozzleSize, quantity: nozzleQuantity }])
      setNozzleSize("")
      setNozzleQuantity("")
    } else {
      toast.error("Please enter both nozzle size and quantity.")
    }
  }

  return (
    <div>
      <h1>Welding Electrode Calculator</h1>

      {/* Form sections */}
      <div>
        <h2>Welding Deposition Calculator</h2>
        <div>
          <input
            type="text"
            placeholder="Vessel Inside Diameter (mm)"
            value={vesselDiameter}
            onChange={(e) => setVesselDiameter(e.target.value)}
          />
          <input
            type="text"
            placeholder="Vessel Length (mm)"
            value={vesselLength}
            onChange={(e) => setVesselLength(e.target.value)}
          />
          <input
            type="text"
            placeholder="Vessel Thickness (mm)"
            value={vesselThickness}
            onChange={(e) => setVesselThickness(e.target.value)}
          />
          <input
            type="text"
            placeholder="No of Longitudinal Seams"
            value={longitudinalSeams}
            onChange={(e) => setLongitudinalSeams(e.target.value)}
          />
          <input
            type="text"
            placeholder="No of Circumferential Seams"
            value={circumferentialSeams}
            onChange={(e) => setCircumferentialSeams(e.target.value)}
          />
          <select
            value={selectedMaterial}
            onChange={(e) => setSelectedMaterial(e.target.value)}
          >
            <option value="">Select Material</option>
            {materials.map((material) => (
              <option key={material} value={material}>
                {material}
              </option>
            ))}
          </select>
        </div>
      </div>

      {[
        {
          title: "Longitudinal Seam",
          rootGap: longitudinalRootGap,
          setRootGap: setLongitudinalRootGap,
          bevelAngle: longitudinalBevelAngle,
          setBevelAngle: setLongitudinalBevelAngle,
          rootFace: longitudinalRootFace,
          setRootFace: setLongitudinalRootFace,
          weldType: longitudinalWeldType,
          setWeldType: setLongitudinalWeldType,
          radius: longitudinalRadius,
          setRadius: setLongitudinalRadius,
          filletSize: longitudinalFilletSize,
          setFilletSize: setLongitudinalFilletSize,
        },
        {
          title: "Circumferential Seam",
          rootGap: circumferentialRootGap,
          setRootGap: setCircumferentialRootGap,
          bevelAngle: circumferentialBevelAngle,
          setBevelAngle: setCircumferentialBevelAngle,
          rootFace: circumferentialRootFace,
          setRootFace: setCircumferentialRootFace,
          weldType: circumferentialWeldType,
          setWeldType: setCircumferentialWeldType,
          radius: circumferentialRadius,
          setRadius: setCircumferentialRadius,
          filletSize: circumferentialFilletSize,
          setFilletSize: setCircumferentialFilletSize,
        },
        {
          title: "Nozzle",
          rootGap: nozzleRootGap,
          setRootGap: setNozzleRootGap,
          bevelAngle: nozzleBevelAngle,
          setBevelAngle: setNozzleBevelAngle,
          rootFace: nozzleRootFace,
          setRootFace: setNozzleRootFace,
          weldType: nozzleWeldType,
          setWeldType: setNozzleWeldType,
          radius: nozzleRadius,
          setRadius: setNozzleRadius,
          filletSize: nozzleFilletSize,
          setFilletSize: setNozzleFilletSize,
        },
      ].map((section, index) => (
        <div key={index}>
          <h2>{section.title}</h2>
          <div>
            <input
              type="text"
              placeholder="Root Gap (mm)"
              value={section.rootGap}
              onChange={(e) => section.setRootGap(e.target.value)}
            />
            <input
              type="text"
              placeholder="Bevel Angle (deg)"
              value={section.bevelAngle}
              onChange={(e) => section.setBevelAngle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Root Face (mm)"
              value={section.rootFace}
              onChange={(e) => section.setRootFace(e.target.value)}
            />
            {section.weldType === "'J'Groove" && (
              <input
                type="text"
                placeholder="Radius (mm)"
                value={section.radius}
                onChange={(e) => section.setRadius(e.target.value)}
              />
            )}
            {section.weldType === "Fillet" && (
              <input
                type="text"
                placeholder="Fillet Size (mm)"
                value={section.filletSize}
                onChange={(e) => section.setFilletSize(e.target.value)}
              />
            )}
          </div>
          <div>
            {weldTypes.map((type) => (
              <label key={type}>
                <input
                  type="radio"
                  name={section.title}
                  value={type}
                  checked={section.weldType === type}
                  onChange={(e) => section.setWeldType(e.target.value)}
                />
                {type}
              </label>
            ))}
          </div>
          {renderWeldDiagram({ weldType: section.weldType, sectionTitle: section.title })}
        </div>
      ))}

      <div>
        <h2>Nozzle Information</h2>
        <div>
          <input
            type="text"
            placeholder="Nozzle Size (mm)"
            value={nozzleSize}
            onChange={(e) => setNozzleSize(e.target.value)}
          />
          <input
            type="number"
            placeholder="Nozzle Quantity"
            value={nozzleQuantity}
            onChange={(e) => setNozzleQuantity(e.target.value)}
          />
          <button onClick={handleAddNozzle}>Add Nozzle</button>
        </div>
        {nozzles.length > 0 && (
          <div>
            <h3>Added Nozzles:</h3>
            <ul>
              {nozzles.map((nozzle, index) => (
                <li key={index}>
                  Size: {nozzle.size} , Quantity: {nozzle.quantity}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <button onClick={() => handleCalculate(!isFormValid)}>Calculate</button>
    </div>
  )
}

export default WeldingCalculator
