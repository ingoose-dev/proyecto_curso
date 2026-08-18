import { Curso } from '../models/curso.model.js'

// ---------------------------------------------------------------------------
// SERVICE — cursos. Habla con la base de datos.
// Las REGLAS DE NEGOCIO (validar estado, propiedad, etc.) pueden ir aquí o en
// el controller: tú decides, pero que estén en el servidor, no en el cliente.
// ---------------------------------------------------------------------------

// TODO: implementa las funciones que tus controllers necesiten. Por ejemplo:
//  - listarCursos()            → Curso.find().populate('profesor').populate('alumnos')
//   - crearCurso(datos)
//   - buscarCurso(id)
//   - editarCurso(id, datos)
//   - borrarCurso(id)
//   - cursosDelProfesor(profesorId)
//   - cursosDelAlumno(alumnoId)
//
// Piensa qué necesita cada ruta y crea solo lo que uses.

export const listarCursos = () => {
    return Curso.find()
        .populate('profesor', '-password')
        .populate('alumnos', '-password')
}

export const crearCurso = (datos) => {
    return Curso.create(datos)
}

export const buscarCurso = (id) => {
    return Curso.findById(id)
        .populate('profesor', '-password')
        .populate('alumnos', '-password')
}

export const editarCurso = (id, datos) => {
    return Curso.findByIdAndUpdate(id, datos, { new: true })
}

export const borrarCurso = (id) => {
    return Curso.findByIdAndDelete(id)
}

export const cursosDelProfesor = (profesorId) => {
    return Curso.find({ profesor: profesorId })
        .populate('profesor', '-password')
        .populate('alumnos', '-password')
}

export const cursosDelAlumno = (alumnoId) => {
    return Curso.find({ alumnos: alumnoId })
        .populate('profesor', '-password')
        .populate('alumnos', '-password')
}

export const matricularAlumno = (cursoId, alumnoId) => {
    return Curso.findByIdAndUpdate(
        cursoId,
        { $addToSet: { alumnos: alumnoId } },
        { new: true }
    ).populate('profesor', '-password').populate('alumnos', '-password')
}

export const desmatricularAlumno = (cursoId, alumnoId) => {
    return Curso.findByIdAndUpdate(
        cursoId,
        { $pull: { alumnos: alumnoId } },
        { new: true }
    ).populate('profesor', '-password').populate('alumnos', '-password')
}