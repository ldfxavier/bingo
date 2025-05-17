"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default function DisplayScreen() {
  const [drawnNumbers, setDrawnNumbers] = useState<string[]>([])
  const [lastNumber, setLastNumber] = useState<string | null>(null)

  // Check for updates every second
  useEffect(() => {
    const checkForUpdates = () => {
      const savedNumbers = localStorage.getItem("bingoNumbers")
      if (savedNumbers) {
        const parsedNumbers = JSON.parse(savedNumbers)
        setDrawnNumbers(parsedNumbers)

        if (parsedNumbers.length > 0) {
          setLastNumber(parsedNumbers[parsedNumbers.length - 1])
        } else {
          setLastNumber(null)
        }
      }
    }

    // Check immediately on mount
    checkForUpdates()

    // Then check every second
    const interval = setInterval(checkForUpdates, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4 flex flex-col">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Image
            src="/images/logo.png"
            alt="Logo do Sistema de Bingo"
            width={150}
            height={150}
            priority
          />
        </div>
      </div>

      {lastNumber && (
        <div className="mb-8">
          <h2 className="text-2xl text-center mb-4 text-gray-700">Último Número Sorteado</h2>
          <div className="flex justify-center">
            <Badge className="text-8xl py-12 px-16 bg-primary text-white">{lastNumber}</Badge>
          </div>
        </div>
      )}

      <Card className="bg-white border border-gray-200 flex-grow shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-gray-700">Todos os Números</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4 md:grid-cols-10">
            {Array.from({ length: 75 }, (_, i) => (i + 1).toString()).map((num) => {
              const isDrawn = drawnNumbers.includes(num)
              return (
                <Badge
                  key={num}
                  className={`text-xl py-3 flex justify-center items-center ${
                    isDrawn ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {num}
                </Badge>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
