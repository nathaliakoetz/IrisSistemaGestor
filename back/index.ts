import express from 'express'
import cors from 'cors'
import clinicaRoutes from "./routes/clinicas"
import profissionalRoutes from "./routes/profissionais"
import dadosUsuariosRoutes from "./routes/dadosusuarios"
import terapeutaRoutes from "./routes/terapeutas"
import legendaRoutes from "./routes/legendas"
import enderecosRoutes from "./routes/enderecos"
import consultasRoutes from "./routes/consultas"
import responsaveisRoutes from "./routes/responsaveis"
import dependentesRoutes from "./routes/dependentes"
import dependentesClinicasRoutes from "./routes/dependentesClinicas"
import responsaveisClinicasRoutes from "./routes/responsaveisClinicas"
import responsaveisDependentesRoutes from "./routes/responsaveisDependentes"
import { getApiDocsHTML } from "./views/apiDocs"


const app = express()
const port = Number(process.env.PORT) || 3001

app.use(express.json())
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use("/clinicas", clinicaRoutes)
app.use("/profissionais", profissionalRoutes)
app.use("/dadosUsuarios", dadosUsuariosRoutes)
app.use("/terapeutas", terapeutaRoutes)
app.use("/legendas", legendaRoutes)
app.use("/enderecos", enderecosRoutes)
app.use("/consultas", consultasRoutes)
app.use("/responsaveis", responsaveisRoutes)
app.use("/dependentes", dependentesRoutes)
app.use("/dependentesClinicas", dependentesClinicasRoutes)
app.use("/responsaveisClinicas", responsaveisClinicasRoutes)
app.use("/responsaveisDependentes", responsaveisDependentesRoutes)

app.get('/', (req, res) => {
  res.send(getApiDocsHTML(port))
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta: ${port}`)
})