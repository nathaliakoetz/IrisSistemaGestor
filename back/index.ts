import express from 'express'
import cors from 'cors'
import clinicaRoutes from "./routes/clinicas"
import profissionalRoutes from "./routes/profissionais"
import dadosUsuariosRoutes from "./routes/dadosusuarios"
import terapeutaRoutes from "./routes/terapeutas"
import funcionarioRoutes from "./routes/funcionarios"
import legendaRoutes from "./routes/legendas"
const app = express()
const port = 3004

app.use(express.json())
app.use(cors())
app.use("/clinicas", clinicaRoutes)
app.use("/profissionais", profissionalRoutes)
app.use("/funcionarios", funcionarioRoutes)
app.use("/dadosUsuarios", dadosUsuariosRoutes)
app.use("/terapeutas", terapeutaRoutes)
app.use("/legendas", legendaRoutes)

app.get('/', (req, res) => {
  res.send('API: Íris Sistema Gestor')
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})