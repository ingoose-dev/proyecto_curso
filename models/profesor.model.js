import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// ---------------------------------------------------------------------------
// MODELO — Profesor.
// ---------------------------------------------------------------------------
// TODO: define el schema del profesor. Campos (ver enunciado):
//   - nombre    (texto, obligatorio)
//   - email     (texto, único, obligatorio)
//   - password  (texto, obligatorio) → se guarda HASHEADO, nunca en texto plano
//
// Pista: usa { timestamps: true } para tener createdAt/updatedAt gratis.

const profesorSchema = new mongoose.Schema(
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
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

profesorSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})

profesorSchema.methods.compararPassword = function (passwordPlano){
  return bcrypt.compare(passwordPlano, this.password)
}

export const Profesor = mongoose.model('Profesor', profesorSchema, 'profesores')
