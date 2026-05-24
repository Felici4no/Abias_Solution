import { readJsonBody } from '../http/readJsonBody.js'
import { sendJson } from '../views/jsonView.js'
import {
  criarUsuario,
  autenticarUsuario,
  vincularMembro,
  buscarUsuarioPorEmail
} from '../models/abiasAuthModel.js'

export async function registrarUsuario(request, response) {
  const body = await readJsonBody(request)
  const { email, senha, nome } = body ?? {}

  if (!email || !senha) {
    return sendJson(response, 400, { error: 'email e senha são obrigatórios' })
  }
  if (senha.length < 6) {
    return sendJson(response, 400, { error: 'senha deve ter no mínimo 6 caracteres' })
  }

  const existente = await buscarUsuarioPorEmail(email)
  if (existente) {
    return sendJson(response, 409, { error: 'Email já cadastrado' })
  }

  const usuario = await criarUsuario({ email, senha, role: 'membro', nome: nome ?? '' })
  return sendJson(response, 201, { usuario })
}

export async function loginUsuario(request, response) {
  const body = await readJsonBody(request)
  const { email, senha } = body ?? {}

  if (!email || !senha) {
    return sendJson(response, 400, { error: 'email e senha são obrigatórios' })
  }

  const usuario = await autenticarUsuario({ email, senha })
  if (!usuario) {
    return sendJson(response, 401, { error: 'Email ou senha incorretos' })
  }

  return sendJson(response, 200, { usuario })
}

export async function vincularMembroAoUsuario(request, response) {
  const { id } = request.params
  const body = await readJsonBody(request)
  const { membroId } = body ?? {}

  if (!membroId) {
    return sendJson(response, 400, { error: 'membroId é obrigatório' })
  }

  const usuario = await vincularMembro(id, membroId)
  if (!usuario) {
    return sendJson(response, 404, { error: 'Usuário não encontrado' })
  }

  return sendJson(response, 200, { usuario })
}
