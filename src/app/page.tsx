"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import FoodCategory from "@/components/FoodCategory";




export default function Main() {

  return (
    <div className="p-4">
      <FoodCategory />
    </div>
  );
}
