import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// ---------------------------------------------------------------------------
// MODELO — Alumno.
// ---------------------------------------------------------------------------
// TODO: define el schema del alumno. Campos (ver enunciado):
//   - nombre    (texto, obligatorio)
//   - email     (texto, único, obligatorio)
//   - telefono  (texto)
//   - password  (texto, obligatorio) → HASHEADO con bcrypt

const alumnoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    telefono: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

alumnoSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})

alumnoSchema.methods.compararPassword = function (passwordPlano){
  return bcrypt.compare(passwordPlano, this.password)
}

export const Alumno = mongoose.model('Alumno', alumnoSchema, 'alumnos')
