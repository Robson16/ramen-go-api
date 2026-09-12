import 'dotenv/config'

import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from '@aws-sdk/client-s3'
import { Client } from 'pg'

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!

// Monta a URL completa baseada no formato do Cloudflare
const ENDPOINT_URL = `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`

const s3Client = new S3Client({
  endpoint: ENDPOINT_URL,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true, // Obrigatório para requisições no Cloudflare R2
})

const BUCKET_NAME = process.env.AWS_BUCKET_NAME!

async function runCleanup() {
  console.log('🔍 Iniciando varredura no Cloudflare R2...')

  // Conexão direta com o Postgres via pg (bypassa problemas de ambiente do Prisma no tsx)
  const db = new Client({ connectionString: process.env.DATABASE_URL })
  await db.connect()

  try {
    // 1. Coleta o estado atual do R2
    const listCommand = new ListObjectsV2Command({ Bucket: BUCKET_NAME })
    const { Contents } = await s3Client.send(listCommand)

    if (!Contents) {
      console.log('✅ O bucket está vazio.')
      return
    }

    const r2Files = Contents.map((file) => file.Key!).filter(Boolean)
    console.log(`📦 Encontrados ${r2Files.length} arquivos no R2.`)

    // 2. Coleta o estado da verdade no Postgres
    const { rows } = await db.query('SELECT url FROM images')
    const dbUrls = rows.map((img) => img.url)
    console.log(`🗄️ Encontrados ${dbUrls.length} registros no Banco de Dados.`)

    // 3. Cruzamento: Identifica arquivos órfãos
    const orphanedFiles = r2Files.filter((key) => !dbUrls.includes(key))

    if (orphanedFiles.length === 0) {
      console.log('✨ Nenhum arquivo órfão encontrado. Tudo limpo!')
      return
    }

    console.log(
      `🗑️ Encontrados ${orphanedFiles.length} arquivos órfãos. Iniciando deleção...`,
    )

    // 4. Executa a purga
    for (const key of orphanedFiles) {
      await s3Client.send(
        new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: key }),
      )
      console.log(`- Deletado: ${key}`)
    }

    console.log('🎉 Limpeza concluída com sucesso!')
  } catch (error) {
    console.error('❌ Erro durante a limpeza:', error)
  } finally {
    // Encerra a conexão para não travar o terminal
    await db.end()
  }
}

runCleanup()
