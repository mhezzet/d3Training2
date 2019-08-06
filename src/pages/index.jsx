import React, { useRef, useEffect } from "react"
import * as d3 from "d3"
import Layout from "../layout/layout"
import revenues from "../data/revenues.json"

export default function IndexPage({ location }) {
  const svg = useRef(null)
  console.log()

  useEffect(() => {
    d3Render(svg)
    window.addEventListener("resize", () => {
      d3Render(svg)
    })
  }, [svg.current])

  return (
    <Layout location={location}>
      <svg ref={svg} width="100%" height="100vh" />
    </Layout>
  )
}

function d3Render(selection, props) {
  if (!selection.current) return

  const canvas = d3.select(selection.current)
  canvas.selectAll("*").remove() //flush the canvas
  const canvasWidth = selection.current.clientWidth
  const canvasHeight = selection.current.clientHeight

  const yValue = d => +d.profit

  // margin convention
  const canvasPadding = { top: 150, bottom: 100, left: 150, right: 10 }
  const canvasInnerWidth =
    canvasWidth - canvasPadding.left - canvasPadding.right
  const canvasInnerHeight =
    canvasHeight - canvasPadding.top - canvasPadding.bottom
  const graph = canvas
    .append("g")
    .attr("transform", `translate(${canvasPadding.left},${canvasPadding.top})`)

  //scales
  const xScale = d3
    .scaleBand()
    .domain(revenues.map(revenue => revenue.month))
    .range([0, canvasInnerWidth])
    .paddingInner(0.3)
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(revenues, yValue)])
    .range([canvasInnerHeight, 0])
    .nice()
  const titleScale = d3
    .scaleLinear()
    .domain([450, 2000])
    .range([20, 80])
    .nice()
  const tickScale = d3
    .scaleLinear()
    .domain([450, 2000])
    .range([10, 24])
    .nice()
  const axesLabelScale = d3
    .scaleLinear()
    .domain([450, 2000])
    .range([17, 47])
    .nice()
  const yLabelYScale = d3
    .scaleLinear()
    .domain([450, 2000])
    .range([90, 45])
    .nice()
  const xLabelYScale = d3
    .scaleLinear()
    .domain([450, 2000])
    .range([60, 20])
    .nice()

  //axes
  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yScale).tickFormat(number => `$${number}`)
  graph
    .append("g")
    .call(xAxis)
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${canvasInnerHeight})`)
    .selectAll(".tick text")
    .style("fill", "#1d2228")
    .style("font-size", tickScale(canvasWidth))

  graph
    .append("g")
    .call(yAxis)
    .attr("class", "y-axis")
    .selectAll(".tick text")
    .style("fill", "#1d2228")
    .style("font-size", tickScale(canvasWidth))

  //bars
  graph
    .selectAll("rect")
    .data(revenues)
    .enter()
    .append("rect")
    .attr("x", d => xScale(d.month))
    .attr("width", xScale.bandwidth())
    .attr("height", d => canvasInnerHeight - yScale(yValue(d)))
    .attr("y", d => yScale(yValue(d)))
    .style("fill", "#1d2228")

  //title
  canvas
    .append("text")
    .text("Revenue Bar Chart")
    .attr("x", "50%")
    .attr("y", 100)
    .style("font-size", titleScale(canvasWidth))
    .style("fill", "#1d2228")

  //x-label
  canvas
    .append("text")
    .text("Month")
    .attr("x", "50%")
    .attr("y", canvasHeight - xLabelYScale(canvasWidth))
    .style("font-size", axesLabelScale(canvasWidth))
    .style("fill", "#1d2228")

  //y-label
  canvas
    .append("text")
    .text("Revenue")
    .attr("x", -canvasHeight / 1.7)
    .attr("y", yLabelYScale(canvasWidth))
    .style("font-size", axesLabelScale(canvasWidth))
    .attr("transform", "rotate(-90)")
    .style("fill", "#1d2228")
}
