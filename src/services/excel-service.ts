import ExcelJS from 'exceljs'
import path from 'path'
import fs from 'fs'
import { IParticipantResult } from '@shared-types/simulation-types'
import { SimulationMode } from '@domain/simulation-mode'
import { Logger } from '@utils/logger'

const TMP_DIR = path.resolve('tmp')

export class ExcelService {
  private readonly logger = new Logger('excel-service')

  async generate(results: IParticipantResult[], mode: SimulationMode): Promise<string> {
    if (!fs.existsSync(TMP_DIR)) {
      fs.mkdirSync(TMP_DIR, { recursive: true })
    }

    const sorted = [...results].sort((a, b) => a.perCapitaIncome - b.perCapitaIncome)

    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('Consolidado')

    sheet.columns = [
      { header: 'Participante', key: 'name', width: 30 },
      { header: 'Renda Total', key: 'totalIncome', width: 18 },
      { header: 'Membros', key: 'membersCount', width: 12 },
      { header: 'Renda Per Capita', key: 'perCapitaIncome', width: 20 },
    ]

    sorted.forEach((r) => sheet.addRow(r))
    sheet.getRow(1).font = { bold: true }

    const fileName = `consolidado_${mode.toString()}_${Date.now()}.xlsx`
    const filePath = path.join(TMP_DIR, fileName)

    await workbook.xlsx.writeFile(filePath)
    this.logger.info(`Planilha gerada: ${filePath}`)

    return filePath
  }
}
