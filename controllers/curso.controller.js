import * as service from '../services/curso.service.js'

// ---------------------------------------------------------------------------
// CONTROLLERS — cursos. Aquí viven las reglas de negocio.
// El id y el rol del usuario que hace la petición vienen en req.usuario
// (lo puso el middleware `proteger` desde el token).
// ---------------------------------------------------------------------------

// GET /api/cursos — todos los cursos (con populate de profesor y alumnos).
export const listar = async (req, res) => {
  try {
    const cursos = await service.listarCursos()
    res.json(cursos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// POST /api/cursos — crea un curso (nace EN_MATRICULA, sin profesor).
export const crear = async (req, res) => {
  try {
    const curso = await service.crearCurso(req.body)
    res.status(201).json(curso)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// DELETE /api/cursos/:id — borra un curso.
export const borrar = async (req, res) => {
  try {
    const curso = await service.borrarCurso(req.params.id)
    if (!curso) return res.status(404).json({ error: 'Curso no encontrado' })
    res.json({ mensaje: 'Curso eliminado' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// PUT /api/cursos/:id - Editar un curso
export const editar = async (req, res) => {
  try {
    const curso = await service.editarCurso(req.params.id, req.body)
    if (!curso) return res.status(404).json({ error: 'Curso no encontrado' })
    res.json(curso)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET /api/cursos/mis-cursos — los cursos que dicta ESTE profesor.
export const misCursos = async (req, res) => {
  try {
    const cursos = await service.cursosDelProfesor(req.usuario.id)
    res.json(cursos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// POST /api/cursos/:id/asignarme — el profesor se asigna un curso libre.
export const asignarme = async (req, res) => {
  try {
    // TODO — REGLA DE NEGOCIO:
    //   1. Busca el curso. Si no existe → 404.
    const curso = await service.buscarCurso(req.params.id)
    if (!curso) return res.status(404).json({ error: 'Curso no encontrado' })
    //   2. Si YA tiene profesor → 409 (nadie se lo quita a otro).
    if (curso.profesor) return res.status(409).json({ error: 'Curso ya tiene profesor' })
    //   3. Si está libre → asígnale req.usuario.id como profesor. Guarda.
    const cursoActualizado = await service.editarCurso(req.params.id, {
      profesor: req.usuario.id
    })

    res.status(201).json(cursoActualizado)

  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// GET /api/cursos/:id/alumnos — solo el profesor que dicta el curso.
export const alumnosDelCurso = async (req, res) => {
  try {
    // 1. Busca el curso. Si no existe → 404.
    const curso = await service.buscarCurso(req.params.id)
    if (!curso) return res.status(404).json({ error: 'Curso no encontrado' })

    // 2. Si el profesor del curso NO es req.usuario.id → 403.
    if (curso.profesor.id.toString() !== req.usuario.id) {
      return res.status(403).json({ error: 'No tienes permiso sobre este curso' })
    }

    // 3. Devuelve la lista de alumnos.
    res.json(curso.alumnos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


// POST /api/cursos/:id/matricularme — el alumno se matricula a sí mismo.
export const matricularme = async (req, res) => {
  try {
    // 1. Busca el curso. Si no existe → 404.
    const curso = await service.buscarCurso(req.params.id)
    if (!curso) return res.status(404).json({ error: 'Curso no encontrado' })

    // 2. Si NO está EN_MATRICULA → 409 (curso cerrado).
    if (curso.estado !== 'EN_MATRICULA') {
      return res.status(409).json({ error: 'El curso no está en período de matrícula' })
    }

    // 3. Si el alumno YA está en el curso → 409 (no duplicar).
    const yaMatriculado = curso.alumnos.some(
      (alumno) => alumno._id.toString() === req.usuario.id
    )
    if (yaMatriculado) {
      return res.status(409).json({ error: 'Ya estás matriculado en este curso' })
    }

    // 4. Agrega req.usuario.id al array de alumnos. Guarda.
    const cursoActualizado = await service.matricularAlumno(req.params.id, req.usuario.id)
    res.json(cursoActualizado)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// GET /api/cursos/mis-matriculas — los cursos donde está matriculado ESTE alumno.
export const misMatriculas = async (req, res) => {
  try {
    const cursos = await service.cursosDelAlumno(req.usuario.id)
    res.json(cursos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


// DELETE /api/cursos/:id/matricularme — el alumno se sale del curso.
export const desmatricularme = async (req, res) => {
  try {
    // 1. Busca el curso. Si no existe → 404.
    const curso = await service.buscarCurso(req.params.id)
    if (!curso) return res.status(404).json({ error: 'Curso no encontrado' })

    // 2. Si NO está EN_MATRICULA → 409 (curso cerrado).
    if (curso.estado !== 'EN_MATRICULA') {
      return res.status(409).json({ error: 'El curso no está en período de matrícula' })
    }

    // 2.5 Si el alumno NO está matriculado → 409 (nada que quitar).
    const estaMatriculado = curso.alumnos.some(
      (alumno) => alumno._id.toString() === req.usuario.id
    )
    if (!estaMatriculado) {
      return res.status(409).json({ error: 'No estás matriculado en este curso' })
    }

    // 3. Quita a req.usuario.id del array de alumnos. Guarda.
    const cursoActualizado = await service.desmatricularAlumno(req.params.id, req.usuario.id)
    res.json(cursoActualizado)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
