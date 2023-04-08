import { Box, Button, Flex, Input, InputGroup, InputLeftAddon, Stack, Text } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'

// models/Employee.type.ts
interface IEmployee {
  id: string
  name: string
  category: string
  company: {
    name: string
    image: string
  }
  happinessLevel: number
}

// 100%  DB - 1  Frontend (90% DB - 0.9  Frontend)

// /interfaces/EmployeeResponse.interface.ts
interface EmployeesResponse {
  data: IEmployee[]
  error: {
    message: string | null
    status: number | null
  }
  loading: boolean
}

// constants/employees-response.const.ts
export const EMPTY_EMPLOYEES_RESPONSE: EmployeesResponse = {
  data: [],
  error: {
    message: '',
    status: null
  },
  loading: false
}

// services/getEmployee.service.ts
export const getEmployeeService = async (): Promise<IEmployee[]> => {
  const response = await import('./db/employee.json')

  const data = new Promise(resolve => {
    setTimeout(() => {
      const employees = response.employees.map((employee, index): IEmployee => ({
        ...employee,
        happinessLevel: Math.floor(Math.random() * 10) + 1,
        id: index.toString()
      }))
      resolve(employees)
    }, 1000)
  })

  const employees = await data as IEmployee[]
  // console.info('🚀 ~>  file: App.tsx:54 ~>  getEmployeeService ~>  employees:', employees)

  return employees
}

const App = (): JSX.Element => {
  const [responsePersisted, setresponsePersisted] = useState<IEmployee[] | []>([])
  const [employees, setEmployees] = useState<EmployeesResponse>(EMPTY_EMPLOYEES_RESPONSE)

  const refSeachByName = useRef<HTMLInputElement | null>(null)
  const refSeachByCategory = useRef<HTMLInputElement | null>(null)

  const initRequest = (): void => {
    console.log('Init Request')
    setEmployees({
      ...EMPTY_EMPLOYEES_RESPONSE,
      loading: true
    })
  }

  const successRequest = (employees: IEmployee[]): void => {
    console.log('Sucess Request')
    setEmployees({
      loading: false,
      error: {
        message: '',
        status: null
      },
      data: employees
    })
  }

  const failureRequest = (msg: string, status: number): void => {
    console.log('Failure Request')
    setEmployees({
      ...EMPTY_EMPLOYEES_RESPONSE,
      error: {
        message: msg,
        status
      }
    })
  }

  const resetSearchEmployee = (): void => {
    console.log('Reset Searh')

    refSeachByName?.current !== null && (refSeachByName.current.value = '')
    refSeachByCategory?.current !== null && (refSeachByCategory.current.value = '')

    setEmployees({
      ...employees,
      data: responsePersisted
    })
  }

  const searchEmployeeBy = (value: string, category: 'name' | 'category'): void => {
    console.log('Search Employee By', value, category)
    if (category !== 'name' && category !== 'category') { setEmployees(employees); return }

    if (value === '' || value === '') { setEmployees(employees); return }

    // includes
    const employeesFiltered = responsePersisted.filter(employee => employee[category].toLowerCase().includes(value.toLowerCase()))

    // startsWith
    // const employeesFiltered = employees.data.filter(employee => employee[category].toLowerCase().startsWith(value.toLowerCase()))

    setEmployees({
      ...employees,
      data: employeesFiltered

    })
  }

  useEffect(() => {
    initRequest()
    getEmployeeService()
      .then(employeeResponse => {
        successRequest(employeeResponse)
        setresponsePersisted(employeeResponse)
      })
      .catch(err => {
        failureRequest(err.message ?? 'Bad Request', 40)
      })
  }, [])

  return (
    <Box
      bg={'#151515'}
      minH={'100vh'}
      w={'100%'}
      padding={'4rem'}
      textColor={'white'}
    >
      <Stack
        display={'flex'}
        flexDir={'row'}
        gap={'2rem'}
        marginBottom={'4rem'}
        flexWrap={'wrap'}
      >
        <InputGroup>
          <InputLeftAddon bg="gray.800" textColor={'blue.300'} >
            by name
          </InputLeftAddon>
          <Input type='text' placeholder='search by category'
            ref={refSeachByName}
            onChange={(e) => {
              searchEmployeeBy(e.target.value.trim(), 'name')
            }}
          />
        </InputGroup>
        <InputGroup>
          <InputLeftAddon bg="gray.900" textColor={'blue.300'} >
            by category
          </InputLeftAddon>
          <Input type='text' placeholder='search by category'
            ref={refSeachByCategory}
            onChange={(e) => {
              searchEmployeeBy(e.target.value.trim(), 'category')
            }}
          />
        </InputGroup>
        <Button
          colorScheme={'pink'}
          onClick={resetSearchEmployee}
        >
          Reset
        </Button>
      </Stack>
      <Text
        textColor={'blue.600'}
        textAlign={'center'}
        as={'h1'}
        marginBottom={'4rem'}
        fontSize={'6xl'}
        fontWeight={'bold'}
      >
        EHTT
      </Text>
      {employees.loading && <Text>loading...</Text>}
      {(employees.error.status != null) && <Text>{employees.error.message}</Text>}
      <Flex flexWrap={'wrap'} flexDir={'row'} gap={'2rem'}>
        {employees.data.map(({ name, id, category, happinessLevel }): JSX.Element => {
          return (
            <Flex
              gap={'1rem'}
              flexDirection={'column'}
              border={'1px solid white'}
              padding={'.5rem 1.5rem'}
              borderRadius={'1rem'}
              minW={'320px'}
              key={id} >
              <Flex
                flexDir={'row'}
                gap={'1rem'}
                justifyContent={'space-between'}
                alignItems={'center'}
              >
                <Text
                  fontSize={'2xl'}
                >{name}</Text>
                <Flex
                  gap={'.5rem'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  flexDir={'row'} >
                  <Text
                    as={'span'}
                    fontSize={'x-small'}
                  >
                    Happiness Level:
                  </Text>
                  <Text as="span"
                    textColor={'blue.400'}
                    fontSize={'xl'}>
                    {happinessLevel}
                  </Text>
                </Flex>
              </Flex>
              <Text textAlign={'left'}>{category}</Text>
              <Button
                colorScheme={'blue'}
              >
                Add Favorite
              </Button>
            </Flex>
          )
        })}

      </Flex>
    </Box>
  )
}

export default App
