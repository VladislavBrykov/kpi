import * as service from '../../services/keyword.service'

export const getAll = async(): Promise<any[]> => {
    return await service.getAll()
}
