"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import "./welding-calculator-result.css"

// Constants for metal deposition per electrode
const METAL_DEPOSITION = {
  "IS 2062 GR.B": { 3.15: 0.0182, "4.00": 0.0288, density: 7.85 },
  "SA 516 GR.60": { 3.15: 0.0182, "4.00": 0.0288, density: 7.85 },
  "SA 516 GR.65": { 3.15: 0.0182, "4.00": 0.0288, density: 7.85 },
  "SA 516 GR.70": { 3.15: 0.0182, "4.00": 0.0288, density: 7.85 },
  "SA 387 GR11 CL2": { 3.15: 0.0182, "4.00": 0.0288, density: 7.85 },
  "SA537 CL-1": { 3.15: 0.0182, "4.00": 0.0288, density: 7.85 },
  "SA 240 GR.304L": { 3.15: 0.0189, "4.00": 0.0299, density: 8.0 },
  "SA 240 GR.304": { 3.15: 0.0189, "4.00": 0.0299, density: 8.0 },
  "SA 240 GR.316": { 3.15: 0.0189, "4.00": 0.0299, density: 8.0 },
  "SA 240 GR.316L": { 3.15: 0.0189, "4.00": 0.0299, density: 8.0 },
  "SA 240 GR.317L": { 3.15: 0.0189, "4.00": 0.0299, density: 8.0 },
  "SA 240 GR.321": { 3.15: 0.0189, "4.00": 0.0299, density: 8.0 },
  "SA 240 UNS 32205": { 3.15: 0.0181, "4.00": 0.0292, density: 7.8 },
  "SA 240 UNS 31803": { 3.15: 0.0181, "4.00": 0.0292, density: 7.8 },
  "SB424 UNS NO8825": { 3.15: 0.0188, "4.00": 0.0304, density: 8.14 },
  "SA 240 UNS 32750": { 3.15: 0.0182, "4.00": 0.0288, density: 7.8 },
  "SB 127 UNS N04400": { 3.15: 0.0204, "4.00": 0.0331, density: 8.83 },
  "SB 168 UNS N06600": { 3.15: 0.0196, "4.00": 0.0317, density: 8.47 },
}

// Define Params type
type Params = {
  bevelAngle: number;
  thickness: number;
  rootGap: number;
  id?: number;
  od?: number;
  length?: number;
  rootFace?: number;
  radius?: number;
  filletSize?: number;
  density: number;
}

// Helper functions
const calculateWidth = (bevelAngle: number, thickness: number) => Math.tan(((bevelAngle / 2) * Math.PI) / 180) * thickness

const calculateArea = (width: number, thickness: number, rootGap: number, afterBG: number = 3.14 * 8 * 8) => {
  const A1 = width * thickness
  const A2 = rootGap * thickness
  const A3 = (width * 2 + rootGap) * 3
  return A1 + A2 + A3 + afterBG
}

const calculateVolume = (totalArea: number, dimension: number, isCircumference: boolean = false) => {
  const factor = isCircumference ? Math.PI : 1
  return (totalArea * dimension * factor) / 1000
}

const calculateWeldDeposition = (volume: number, density: number) => (volume * density) / 1000

// Welding calculation functions
const singleVCircSeam = (params: Params) => {
  const { bevelAngle, thickness, rootGap, id = 0, density } = params
  const width = calculateWidth(bevelAngle, thickness)
  const totalArea = calculateArea(width, thickness, rootGap)
  const circumference = (id + thickness) * Math.PI
  const volume = calculateVolume(totalArea, circumference, true)
  return calculateWeldDeposition(volume, density)
}

const singleVLongSeam = (params: Params) => {
  const { bevelAngle, thickness, rootGap, length, density } = params
  const width = calculateWidth(bevelAngle, thickness)
  const totalArea = calculateArea(width, thickness, rootGap)
  const volume = calculateVolume(totalArea, length ?? 0)
  return calculateWeldDeposition(volume, density)
}

const singleVNozzle = (params: Params) => {
  const { bevelAngle, thickness, rootGap, od, density } = params
  const width = calculateWidth(bevelAngle, thickness)
  const totalArea = calculateArea(width, thickness, rootGap)
  const circumference = (od ?? 0) * Math.PI
  const volume = calculateVolume(totalArea, circumference)
  return calculateWeldDeposition(volume, density)
}

const doubleVCircSeam = (params: Params) => {
  const { bevelAngle, thickness, rootGap, id, density } = params
  const th1 = (2 / 3) * thickness
  const th2 = (1 / 3) * thickness
  const width1 = calculateWidth(bevelAngle, th1)
  const width2 = calculateWidth(bevelAngle, th2)
  const A1 = th1 * width1
  const A2 = th2 * width2
  const A3 = rootGap * thickness
  const A4 = 3.14 * 8 * 8
  const A5 = (width1 + width2 + rootGap + 6) * 2 * 3
  const totalArea = A1 + A2 + A3 + A4 + A5
  const circumference = ((id ?? 0) + thickness) * Math.PI
  const volume = calculateVolume(totalArea, circumference, true)
  return calculateWeldDeposition(volume, density)
}

const doubleVLongSeam = (params: Params) => {
  const { bevelAngle, thickness, rootGap, length, density } = params
  const th1 = (2 / 3) * thickness
  const th2 = (1 / 3) * thickness
  const width1 = calculateWidth(bevelAngle, th1)
  const width2 = calculateWidth(bevelAngle, th2)
  const A1 = th1 * width1
  const A2 = th2 * width2
  const A3 = rootGap * thickness
  const A4 = 3.14 * 8 * 8
  const A5 = (width1 + width2 + rootGap + 6) * 2 * 3
  const totalArea = A1 + A2 + A3 + A4 + A5
  const volume = calculateVolume(totalArea, length ?? 0)
  return calculateWeldDeposition(volume, density)
}

const doubleVNozzle = (params: Params) => {
  const { bevelAngle, thickness, rootGap, od, density } = params
  const th1 = (2 / 3) * thickness
  const th2 = (1 / 3) * thickness
  const width1 = calculateWidth(bevelAngle, th1)
  const width2 = calculateWidth(bevelAngle, th2)
  const A1 = th1 * width1
  const A2 = th2 * width2
  const A3 = rootGap * thickness
  const A4 = 3.14 * 8 * 8
  const A5 = (width1 + width2 + rootGap + 6) * 2 * 3
  const totalArea = A1 + A2 + A3 + A4 + A5
  const circumference = (od ?? 0) * Math.PI
  const volume = calculateVolume(totalArea, circumference)
  return calculateWeldDeposition(volume, density)
}

const jCircSeam = (params: Params) => {
  const { bevelAngle, thickness, rootGap, rootFace = 0, radius = 0, id = 0, density } = params
  const A1 = (Math.PI * radius * radius) / 2
  const height = thickness - radius - rootFace
  const width = calculateWidth(bevelAngle, height)
  const A2 = width * height
  const A3 = height * radius * 2
  const A4 = rootGap * thickness
  const A5 = (radius * 2 + width * 2 + 2 + 6) * 3
  const A6 = 3.14 * 10 * 10
  const totalArea = A1 + A2 + A3 + A4 + A5 + A6
  const circumference = (id + thickness) * Math.PI
  const volume = calculateVolume(totalArea, circumference, true)
  return calculateWeldDeposition(volume, density)
}

const jLongSeam = (params: Params) => {
  const { bevelAngle, thickness, rootGap, rootFace = 0, radius = 0, length = 0, density } = params
  const A1 = (Math.PI * radius * radius) / 2
  const height = thickness - radius - rootFace
  const width = calculateWidth(bevelAngle, height)
  const A2 = width * height
  const A3 = height * radius * 2
  const A4 = rootGap * thickness
  const A5 = (radius * 2 + width * 2 + 2 + 6) * 3
  const A6 = 3.14 * 10 * 10
  const totalArea = A1 + A2 + A3 + A4 + A5 + A6
  const volume = calculateVolume(totalArea, length)
  return calculateWeldDeposition(volume, density)
}

const jNozzle = (params: Params) => {
  const { bevelAngle, thickness, rootGap, rootFace, radius, od, density } = params
  const A1 = (Math.PI * (radius ?? 0) * (radius ?? 0)) / 2
  const height = thickness - (radius ?? 0) - (rootFace ?? 0)
  const width = calculateWidth(bevelAngle, height)
  const A2 = width * height
  const A3 = height * (radius ?? 0) * 2
  const A4 = rootGap * thickness
  const A5 = ((radius ?? 0) * 2 + width * 2 + 2 + 6) * 3
  const A6 = 3.14 * 10 * 10
  const totalArea = A1 + A2 + A3 + A4 + A5 + A6
  const circumference = (od ?? 0) * Math.PI
  const volume = calculateVolume(totalArea, circumference)
  return calculateWeldDeposition(volume, density)
}

const filletCircSeam = (params: Params) => {
  const { bevelAngle, thickness, rootGap, filletSize, id, density } = params
  const A1 = (thickness * calculateWidth(bevelAngle, thickness) * thickness) / 2
  const A2 = rootGap * thickness
  const A3 = (filletSize ?? 0) * (filletSize ?? 0) * 0.5
  const A4 = 3.14 * 10 * 10
  const totalArea = A1 + A2 + A3 + A4
  const circumference = ((id ?? 0) + thickness) * Math.PI
  const volume = calculateVolume(totalArea, circumference, true)
  return calculateWeldDeposition(volume, density)
}

const filletLongSeam = (params: Params) => {
  const { bevelAngle, thickness, rootGap, filletSize, length, density } = params
  const A1 = (thickness * calculateWidth(bevelAngle, thickness) * thickness) / 2
  const A2 = rootGap * thickness
  const A3 = (filletSize ?? 0) * (filletSize ?? 0) * 0.5
  const A4 = 3.14 * 10 * 10
  const totalArea = A1 + A2 + A3 + A4
  const volume = calculateVolume(totalArea, length ?? 0)
  return calculateWeldDeposition(volume, density)
}

const filletNozzle = (params: Params) => {
  const { bevelAngle, thickness, rootGap, filletSize, od, density } = params
  const A1 = (thickness * calculateWidth(bevelAngle, thickness) * thickness) / 2
  const A2 = rootGap * thickness
  const A3 = (filletSize ?? 0) * (filletSize ?? 0) * 0.5
  const A4 = 3.14 * 10 * 10
  const totalArea = A1 + A2 + A3 + A4
  const circumference = (od ?? 0) * Math.PI
  const volume = calculateVolume(totalArea, circumference)
  return calculateWeldDeposition(volume, density)
}

const WeldingCalculatorResult = () => {
  const location = useLocation()
  const { formData: Data } = location.state

  const [results, setResults] = useState({
    totalWeldDeposition: 0,
    totalCircDeposition: 0,
    totalLongDeposition: 0,
    totalNozzleDeposition: 0,
    electrodeConsumption: { "3.15mm": 0, "4mm": 0 },
    sawConsumption: 0,
  })

  useEffect(() => {
    const calculateResults = () => {
      const density = METAL_DEPOSITION[Data.selectedMaterial as keyof typeof METAL_DEPOSITION].density
      const params = {
        bevelAngle: Number.parseFloat(Data.longitudinalBevelAngle),
        thickness: Number.parseFloat(Data.vesselThickness),
        rootGap: Number.parseFloat(Data.longitudinalRootGap),
        id: Number.parseFloat(Data.vesselDiameter) || 0,
        od: Number.parseFloat(Data.vesselDiameter) + 2 * Number.parseFloat(Data.vesselThickness),
        length: Number.parseFloat(Data.vesselLength),
        rootFace: Number.parseFloat(Data.longitudinalRootFace),
        radius: Number.parseFloat(Data.longitudinalRadius) || 0,
        filletSize: Number.parseFloat(Data.longitudinalFilletSize) || 0,
        density: density,
      }

      let totalCircDeposition = 0
      let totalLongDeposition = 0
      let totalNozzleDeposition = 0

      // Calculate circumferential seam deposition
      if (Data.circumferentialWeldType === "Single V") {
        totalCircDeposition = singleVCircSeam(params) * Number.parseFloat(Data.circumferentialSeams)
      } else if (Data.circumferentialWeldType === "Double V") {
        totalCircDeposition = doubleVCircSeam(params) * Number.parseFloat(Data.circumferentialSeams)
      } else if (Data.circumferentialWeldType === "'J'Groove") {
        totalCircDeposition = jCircSeam(params) * Number.parseFloat(Data.circumferentialSeams)
      } else if (Data.circumferentialWeldType === "Fillet") {
        totalCircDeposition = filletCircSeam(params) * Number.parseFloat(Data.circumferentialSeams)
      }

      // Calculate longitudinal seam deposition
      if (Data.longitudinalWeldType === "Single V") {
        totalLongDeposition = singleVLongSeam(params) * Number.parseFloat(Data.longitudinalSeams)
      } else if (Data.longitudinalWeldType === "Double V") {
        totalLongDeposition = doubleVLongSeam(params) * Number.parseFloat(Data.longitudinalSeams)
      } else if (Data.longitudinalWeldType === "'J'Groove") {
        totalLongDeposition = jLongSeam(params) * Number.parseFloat(Data.longitudinalSeams)
      } else if (Data.longitudinalWeldType === "Fillet") {
        totalLongDeposition = filletLongSeam(params) * Number.parseFloat(Data.longitudinalSeams)
      }

      // Calculate nozzle deposition
      Data.nozzles.forEach((nozzle: { size: string; quantity: string }) => {
        const nozzleParams: Params = { ...params, od: Number.parseFloat(nozzle.size) }
        if (Data.nozzleWeldType === "Single V") {
          totalNozzleDeposition += singleVNozzle(nozzleParams) * Number.parseFloat(nozzle.quantity)
        } else if (Data.nozzleWeldType === "Double V") {
          totalNozzleDeposition += doubleVNozzle(nozzleParams) * Number.parseFloat(nozzle.quantity)
        } else if (Data.nozzleWeldType === "'J'Groove") {
          totalNozzleDeposition += jNozzle(nozzleParams) * Number.parseFloat(nozzle.quantity)
        } else if (Data.nozzleWeldType === "Fillet") {
          totalNozzleDeposition += filletNozzle(nozzleParams) * Number.parseFloat(nozzle.quantity)
        }
      })

      const totalWeldDeposition = totalCircDeposition + totalLongDeposition + totalNozzleDeposition

      const electrodeConsumption = {
        "3.15mm": Math.ceil(totalWeldDeposition / METAL_DEPOSITION[Data.selectedMaterial as keyof typeof METAL_DEPOSITION]["3.15"]),
        "4mm": Math.ceil(totalWeldDeposition / METAL_DEPOSITION[Data.selectedMaterial as keyof typeof METAL_DEPOSITION]["4.00"]),
      }

      const sawConsumption = totalWeldDeposition * 1.1

      setResults({
        totalWeldDeposition,
        totalCircDeposition,
        totalLongDeposition,
        totalNozzleDeposition,
        electrodeConsumption,
        sawConsumption,
      })
    }

    calculateResults()
  }, [Data])

  return (
    <div>
      <div>
        <div>
          <h3>Weld Deposition Calculator Results</h3>
        </div>
      </div>

      <div>
        <div>
          <h4>Weld Deposition Overview</h4>
          <div>
            <div>
              <p>Total Weld Deposition (in kg):</p>
              <p>{results.totalWeldDeposition.toFixed(2)}</p>
            </div>
            <div>
              <p>Longitudinal Weld Deposition:</p>
              <p>{results.totalLongDeposition.toFixed(2)}</p>
            </div>
            <div>
              <p>Circumferential Weld Deposition:</p>
              <p>{results.totalCircDeposition.toFixed(2)}</p>
            </div>
            <div>
              <p>Total Nozzles Weld Deposition:</p>
              <p>{results.totalNozzleDeposition.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div>
          <h4>Electrode Consumption</h4>
          <table>
            <thead>
              <tr>
                <th>Size</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Φ 3.15 mm</td>
                <td>{results.electrodeConsumption["3.15mm"]}</td>
              </tr>
              <tr>
                <td>Φ 4.00 mm</td>
                <td>{results.electrodeConsumption["4mm"]}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h4>SAW Consumption</h4>
          <p>{results.sawConsumption.toFixed(2)} kg</p>
        </div>
      </div>
    </div>
  )
}

export default WeldingCalculatorResult
