import { Adapter, FetchOptions, } from '../../adapters/types';
import { CHAIN } from '../../helpers/chains';
import { addTokensReceived } from '../../helpers/token';

// total harvest strategy fee is 7%
const totalFee = 7;
//call fee is 0.05%
const callFee = 0.05;
// 6.95% of the total fee goes to the vault
const vaultFee = totalFee - callFee;

const adapter: Adapter = {
    adapter: {
        [CHAIN.SONIC]: {
            fetch: async (options: FetchOptions) => {
                const tokens = ['0x039e2fb66102314ce7b64ce5ce3e5183bc94ad38']; //wS
                const targets = ['0xad1bB693975C16eC2cEEF65edD540BC735F8608B'];
    
                const dailyRevenue = await addTokensReceived({ options, targets, tokens });
                const dailyFees = dailyRevenue.clone(totalFee / vaultFee);  // Total fees = protocol revenue * (7/6.95)
                const dailyProtocolRevenue = dailyRevenue 
    
                return { dailyFees, dailyRevenue, dailyProtocolRevenue }
            },
            start: '2025-01-02',
            meta: {
                methodology: {
                    Fees: `${totalFee}% of each harvest is charged as a performance fee`,
                    Revenue: `All fees except for ${callFee}% to call fee are revenue`,
                }
            }
        }
    },
    version: 2,
};

export default adapter