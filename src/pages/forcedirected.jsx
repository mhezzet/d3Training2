import React, { useState, useRef, useEffect } from "react"
import * as d3 from "d3"
import Layout from "../layout/layout"
import data from "../data/miserables.json"

export default function ForceDirected({ location }) {
  const svg = useRef(null)

  useEffect(() => {
    d3Render(svg)
  }, [svg.current])

  return (
    <Layout location={location}>
      <h1 className="mt-4 text-2xl">Force Directed Graph</h1>
      <svg style={{ marginTop: 50 }} ref={svg} width="800" height="700" />
    </Layout>
  )
}

function d3Render(selection) {
  if (!selection.current) return

  const canvas = d3.select(selection.current)

  const canvasWidth = canvas.attr("width")
  const canvasHeight = canvas.attr("height")

  //scales
  const colorScale = d3.scaleOrdinal(d3.schemeSet2)

  //links
  const links = canvas
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
    .attr("stroke", "#D0D0D0")
    .attr("stroke-width", d => Math.sqrt(d.value))

  //nodes
  const nodes = canvas
    .append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(data.nodes)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("fill", d => colorScale(d.group))
    .call(
      d3
        .drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded)
    )

  //simulation
  const simulation = d3
    .forceSimulation()
    .force("center", d3.forceCenter(canvasWidth / 2, canvasHeight / 2))
    .force("charge", d3.forceManyBody().strength(-50))
    .force("collide", d3.forceCollide(10).strength(0.9))
    .force("link", d3.forceLink().id(d => d.id))

  simulation.nodes(data.nodes).on("tick", ticked)

  simulation.force("link").links(data.links)

  //link simulation with displayed elements
  function ticked() {
    links
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)

    nodes.attr("cx", d => d.x).attr("cy", d => d.y)
  }

  //drag event listeners
  function dragStarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.7).restart()
    d.fx = d.x
    d.fy = d.y
  }
  function dragged(d) {
    d.fx = d3.event.x
    d.fy = d3.event.y
  }
  function dragEnded(d) {
    if (!d3.event.active) simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
  }
}
