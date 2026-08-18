import { Profesor } from '../models/profesor.model.js'
import * as service from '../services/auth.service.js'

// ---------------------------------------------------------------------------
// CONTROLLERS — autenticación.
// Cada uno recibe la petición, llama al service, y responde con el status
// correcto. Envuelve todo en try/catch para no reventar el servidor.
// ---------------------------------------------------------------------------

// POST /api/auth/registro/profesor
export const registrarProfesor = async (req, res) => {
  try {
    const { profesor, token } = await service.registrarProfesor(req.body)
    res.status(201).json({ profesor, token })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// POST /api/auth/registro/alumno
export const registrarAlumno = async (req, res) => {
  try {
    const { alumno, token } = await service.registrarAlumno(req.body)
    res.status(201).json({ alumno, token })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const login = await service.login(email, password)

    if (!login) {
      return res.status(401).json({ error: 'credenciales invalidas' })
    }

    return res.status(200).json({ login })
    
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
