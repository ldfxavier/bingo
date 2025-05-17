"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"
import Image from "next/image"

export default function ControlPanel() {
  const [number, setNumber] = useState("")
  const [drawnNumbers, setDrawnNumbers] = useState<string[]>([])
  const router = useRouter()

  // Load drawn numbers from localStorage on component mount
  useEffect(() => {
    const savedNumbers = localStorage.getItem("bingoNumbers")
    if (savedNumbers) {
      setDrawnNumbers(JSON.parse(savedNumbers))
    }
  }, [])

  // Save drawn numbers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("bingoNumbers", JSON.stringify(drawnNumbers))
  }, [drawnNumbers])

  const handleAddNumber = () => {
    if (!number) return

    // Check if number is valid (1-75 for standard bingo)
    const num = Number.parseInt(number)
    if (isNaN(num) || num < 1 || num > 75) {
      alert("Por favor, digite um número válido entre 1 e 75.")
      return
    }

    // Check if number is already drawn
    if (drawnNumbers.includes(number)) {
      alert("Este número já foi sorteado!")
      return
    }

    const updatedNumbers = [...drawnNumbers, number]
    setDrawnNumbers(updatedNumbers)

    // Atualizar localStorage imediatamente
    localStorage.setItem("bingoNumbers", JSON.stringify(updatedNumbers))

    setNumber("")
  }

  const handleRemoveNumber = (numToRemove: string) => {
    const updatedNumbers = drawnNumbers.filter((num) => num !== numToRemove)
    setDrawnNumbers(updatedNumbers)

    // Atualizar localStorage imediatamente
    localStorage.setItem("bingoNumbers", JSON.stringify(updatedNumbers))
  }

  const handleClearAll = () => {
    if (confirm("Tem certeza que deseja limpar todos os números?")) {
      setDrawnNumbers([])

      // Atualizar localStorage imediatamente
      localStorage.setItem("bingoNumbers", JSON.stringify([]))
    }
  }

  const openDisplayScreen = () => {
    window.open("/display", "_blank")
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card>
        <CardHeader className="bg-white border-b">
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/images/logo.png"
              alt="Logo do Sistema de Bingo"
              width={150}
              height={150}
              priority
            />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex gap-2 mb-6">
            <Input
              type="number"
              placeholder="Digite o número sorteado"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddNumber()}
              min="1"
              max="75"
              className="text-xl"
            />
            <Button onClick={handleAddNumber}>Adicionar</Button>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Último número sorteado:</h3>
            {drawnNumbers.length > 0 ? (
              <div className="flex justify-center">
                <Badge className="text-4xl py-6 px-8 bg-primary">{drawnNumbers[drawnNumbers.length - 1]}</Badge>
              </div>
            ) : (
              <p className="text-center text-muted-foreground">Nenhum número sorteado ainda</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Todos os números sorteados:</h3>
              <Button variant="destructive" size="sm" onClick={handleClearAll} disabled={drawnNumbers.length === 0}>
                Limpar Todos
              </Button>
            </div>

            <div className="grid grid-cols-5 gap-2 md:grid-cols-8">
              {drawnNumbers.map((num, index) => (
                <Badge key={index} className="text-lg py-2 flex justify-between items-center group">
                  {num}
                  <button
                    onClick={() => handleRemoveNumber(num)}
                    className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col justify-center border-t pt-6">
          <Button size="lg" onClick={openDisplayScreen} className="w-full md:w-auto mb-4">
            Abrir Tela de Exibição
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
