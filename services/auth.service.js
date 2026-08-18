import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JWT_SECRET, JWT_EXPIRA } from '../config/jwt.js'
import { Profesor } from '../models/profesor.model.js'
import { Alumno } from '../models/alumno.model.js'

// ---------------------------------------------------------------------------
// SERVICE — autenticación. Habla con la base de datos y con bcrypt/jwt.
// El controller no toca la base directamente: llama a estas funciones.
// ---------------------------------------------------------------------------

// Firma un token con el id y el rol. Úsalo al registrar y al hacer login.
export const firmarToken = (id, rol) =>
  jwt.sign({ id, rol }, JWT_SECRET, { expiresIn: JWT_EXPIRA })

// TODO: registra un profesor.
//   - hashea la password con bcrypt (bcrypt.hash(password, 10))
//   - créalo en la base
//   - devuelve { token, profesor } (sin la password)
export const registrarProfesor = async (datos) => {
  const profesor = await Profesor.create(datos)
  return { profesor, token: null }
}

// TODO: registra un alumno (igual que el profesor).
export const registrarAlumno = async (datos) => {
  const alumno = await Alumno.create(datos)
  return { alumno, token: null }
}

// TODO: login.
//   - busca al usuario por email (en Profesor y en Alumno)
//   - compara la password con bcrypt.compare(...)
//   - si coincide, devuelve { token, rol } con el rol correcto
//   - si no, devuelve null (para que el controller responda 401)
export const login = async (email, password) => {
  const profesor = await Profesor.findOne({ email })
  const alumno = await Alumno.findOne({ email })

  if (!profesor && !alumno) return null

  if (profesor) {
    const coincide = await profesor.compararPassword(password)
    if (!coincide) return null
    const data = {
      'rol': 'profesor',
      'id': profesor._id,
      'token': jwt.sign({ rol: 'profesor', id: profesor._id }, JWT_SECRET, { expiresIn: JWT_EXPIRA })
    }
    return data
  }

  if (alumno) {
    const coincide = await alumno.compararPassword(password)
    if (!coincide) return null
    const data = {
      'rol': 'alumno',
      'id': alumno._id,
      'token': jwt.sign({ rol: 'alumno', id: alumno._id }, JWT_SECRET, { expiresIn: JWT_EXPIRA })
    }
    return data
  }

}
