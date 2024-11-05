import express from 'express'
import cors from 'cors'
import clinicaRoutes from "./routes/clinicas"
import dadosUsuariosRoutes from "./routes/dadosusuarios"
const app = express()
const port = 3004

app.use(express.json())
app.use(cors())
app.use("/clinicas", clinicaRoutes)
app.use("/dadosUsuarios", dadosUsuariosRoutes)

app.get('/', (req, res) => {
  res.send('API: Sistema de Pokedex')
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})