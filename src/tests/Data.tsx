import { Table, Thead, Tbody, Tr, Th, Td, TableCaption, Stack } from "@chakra-ui/react"
import { useRecoilState } from "recoil"
import {
  永续合约累计交易额Atom,
  永续合约当前看涨期权持仓量Atom,
  永续合约当前看跌期权持仓量Atom,
  永续合约累计交易量Atom,
  永续合约累计交易笔数Atom,
  永续合约累计清算额Atom,
  永续合约区块高度Atom,
} from "../state/futures"

import {
  期权累计交易量Atom,
  期权当前看涨期权持仓量Atom,
  期权当前看跌期权持仓量Atom,
  期权累计交易笔数Atom,
  期权累计交易额Atom,
  期权行权时间分布Atom,
  期权区块高度Atom,
} from "../state/options"
import { 期权交易用户Atom, 永续合约交易用户Atom, 活跃用户Atom, 新增用户Atom } from "../state/users"
import useFetchFuturesTxlist from "../hooks/useFetchFuturesTxlist"

const Data = () => {
  const futures_txlist = useFetchFuturesTxlist()

  const [永续合约区块高度] = useRecoilState(永续合约区块高度Atom)
  const [永续合约累计交易额] = useRecoilState(永续合约累计交易额Atom)
  const [永续合约累计交易量] = useRecoilState(永续合约累计交易量Atom)
  const [永续合约当前看涨期权持仓量] = useRecoilState(永续合约当前看涨期权持仓量Atom)
  const [永续合约当前看跌期权持仓量] = useRecoilState(永续合约当前看跌期权持仓量Atom)
  const [永续合约累计交易笔数] = useRecoilState(永续合约累计交易笔数Atom)
  const [永续合约累计清算额] = useRecoilState(永续合约累计清算额Atom)

  const [期权区块高度] = useRecoilState(期权区块高度Atom)
  const [期权累计交易量] = useRecoilState(期权累计交易量Atom)
  const [期权当前看涨期权持仓量] = useRecoilState(期权当前看涨期权持仓量Atom)
  const [期权当前看跌期权持仓量] = useRecoilState(期权当前看跌期权持仓量Atom)
  const [期权累计交易笔数] = useRecoilState(期权累计交易笔数Atom)
  const [期权累计交易额] = useRecoilState(期权累计交易额Atom)
  const [期权行权时间分布] = useRecoilState(期权行权时间分布Atom)

  const [期权交易用户] = useRecoilState(期权交易用户Atom)
  const [永续合约交易用户] = useRecoilState(永续合约交易用户Atom)
  const [活跃用户] = useRecoilState(活跃用户Atom)
  const [新增用户] = useRecoilState(新增用户Atom)

  return (
    <Stack alignItems="center" direction={"row"} p={20}>
      <Table variant="simple">
        <TableCaption>永续合约</TableCaption>
        <Thead>
          <Tr>
            <Th>键名</Th>
            <Th>值</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>区块高度</Td>
            <Td>{永续合约区块高度}</Td>
          </Tr>
          <Tr>
            <Td>累计交易额</Td>
            <Td>{永续合约累计交易额}</Td>
          </Tr>
          <Tr>
            <Td>累计交易量</Td>
            <Td>{永续合约累计交易量}</Td>
          </Tr>
          <Tr>
            <Td>当前看涨期权持仓量</Td>
            <Td>{永续合约当前看涨期权持仓量}</Td>
          </Tr>
          <Tr>
            <Td>当前看跌期权持仓量</Td>
            <Td>{永续合约当前看跌期权持仓量}</Td>
          </Tr>
          <Tr>
            <Td>累计交易笔数</Td>
            <Td>{永续合约累计交易笔数}</Td>
          </Tr>
          <Tr>
            <Td>累计清算额</Td>
            <Td>{永续合约累计清算额}</Td>
          </Tr>
        </Tbody>
      </Table>
      <Table variant="simple">
        <TableCaption>期权</TableCaption>
        <Thead>
          <Tr>
            <Th>键名</Th>
            <Th>值</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>区块高度</Td>
            <Td>{期权区块高度}</Td>
          </Tr>
          <Tr>
            <Td>累计交易额</Td>
            <Td>{期权累计交易额}</Td>
          </Tr>
          <Tr>
            <Td>累计交易量</Td>
            <Td>{期权累计交易量}</Td>
          </Tr>
          <Tr>
            <Td>当前看涨期权持仓量</Td>
            <Td>{期权当前看涨期权持仓量}</Td>
          </Tr>
          <Tr>
            <Td>当前看跌期权持仓量</Td>
            <Td>{期权当前看跌期权持仓量}</Td>
          </Tr>
          <Tr>
            <Td>累计交易笔数</Td>
            <Td>{期权累计交易笔数}</Td>
          </Tr>
          <Tr>
            <Td>多空分布</Td>
            <Td></Td>
          </Tr>
          <Tr>
            <Td>行权时间分布</Td>
            <Td>{期权行权时间分布}</Td>
          </Tr>
        </Tbody>
      </Table>

      <Table>
        <TableCaption>用户</TableCaption>
        <Thead>
          <Tr>
            <Th>键名</Th>
            <Th>值</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>累计用户</Td>
            <Td></Td>
          </Tr>
          <Tr>
            <Td>永续合约交易用户</Td>
            <Td>{Object.keys(永续合约交易用户).length}</Td>
          </Tr>
          <Tr>
            <Td>期权交易用户</Td>
            <Td>{Object.keys(期权交易用户).length}</Td>
          </Tr>
          <Tr>
            <Td>新增用户</Td>
            <Td></Td>
          </Tr>
          <Tr>
            <Td>活跃用户</Td>
            <Td></Td>
          </Tr>
        </Tbody>
      </Table>
    </Stack>
  )
}

export default Data
