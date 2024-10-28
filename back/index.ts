import express from 'express'
import cors from 'cors'
import gruposRoutes from './routes/grupos'
import pokemonsRoutes from './routes/pokemons'
import treinadorRoutes from "./routes/treinadores"
import capturasRoutes from "./routes/capturas"
const app = express()
const port = 3004

app.use(express.json())
app.use(cors())
app.use("/grupos", gruposRoutes)
app.use("/pokemons", pokemonsRoutes)
app.use("/treinadores", treinadorRoutes)
app.use("/capturas", capturasRoutes)

app.get('/', (req, res) => {
  res.send('API: Sistema de Pokedex')
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})