export type ProofOfShipProject = {
  name: string;
  category: string;
  status: "Building" | "Shipped" | "Reviewing" | "Funded";
  description: string;
  milestone: string;
};

export const proofOfShipProjects: ProofOfShipProject[] = [
  { name: "Mento Stables", category: "DeFi", status: "Funded", description: "Stablecoin protocol nativo do ecossistema Celo.", milestone: "Auditoria concluída" },
  { name: "Valora Wallet", category: "Mobile", status: "Shipped", description: "Carteira mobile-first para pagamentos em cUSD/cEUR.", milestone: "v3 lançada" },
  { name: "GoodDollar", category: "UBI", status: "Funded", description: "Renda básica universal on-chain via airdrop diário.", milestone: "1M+ usuários" },
  { name: "Halofi", category: "Savings", status: "Building", description: "Pools de poupança gamificadas com yield.", milestone: "Beta fechado" },
  { name: "Ubeswap", category: "DEX", status: "Shipped", description: "DEX comunitário para tokens nativos Celo.", milestone: "v3 concentrated liq." },
  { name: "Spirals Protocol", category: "Climate", status: "Funded", description: "Refi infraestrutura para tokenização de carbono.", milestone: "Mainnet ativa" },
  { name: "Glo Dollar", category: "Stablecoin", status: "Shipped", description: "Stablecoin filantrópico com receita doada.", milestone: "Integrado MiniPay" },
  { name: "Kotani Pay", category: "Off-ramp", status: "Funded", description: "Conversão cripto-mobile money para África.", milestone: "8 países ativos" },
  { name: "Impact Market", category: "UBI", status: "Building", description: "Comunidades de UBI auto-geridas globalmente.", milestone: "Audit em andamento" },
  { name: "Plastiks", category: "ReFi", status: "Reviewing", description: "Tokenização de remoção de resíduos plásticos.", milestone: "Proposta CGP" },
  { name: "Ariswap", category: "DEX", status: "Building", description: "AMM otimizado para microtransações.", milestone: "Testnet" },
  { name: "Esusu", category: "Savings", status: "Building", description: "Grupos rotativos de poupança digitalizados.", milestone: "Piloto Nigéria" },
  { name: "Talent Protocol", category: "Identity", status: "Shipped", description: "Reputação on-chain para builders.", milestone: "Builder Score live" },
  { name: "Rebel Bots", category: "Gaming", status: "Reviewing", description: "Game P2E com NFTs interoperáveis.", milestone: "Demo jogável" },
  { name: "FonBnk", category: "On-ramp", status: "Funded", description: "Compra de cripto via créditos de celular pré-pago.", milestone: "12 países" },
  { name: "Pretium Finance", category: "Payments", status: "Shipped", description: "Pagamentos B2B cross-border na África.", milestone: "$2M+ volume" },
  { name: "Toucan Protocol", category: "ReFi", status: "Funded", description: "Bridge de créditos de carbono on-chain.", milestone: "Carbon pools" },
  { name: "Latitude Labs", category: "Infra", status: "Building", description: "SDK para apps MiniPay-first.", milestone: "Alpha SDK" },
  { name: "WAGE Protocol", category: "Payroll", status: "Reviewing", description: "Folha de pagamento em stablecoins.", milestone: "Piloto Quênia" },
  { name: "Celo Camp Cohort 8", category: "Accelerator", status: "Building", description: "Cohort atual de 12 startups acelerando.", milestone: "Demo Day Q1" },
];

export type ValidatorRow = {
  name: string;
  votingPower: string;
  uptime: string;
  status: "Elected" | "Standby";
  group: string;
};

export const validatorRows: ValidatorRow[] = [
  { name: "Figment", group: "Figment", votingPower: "12.4M", uptime: "99.98%", status: "Elected" },
  { name: "Anchorage Digital", group: "Anchorage", votingPower: "9.1M", uptime: "99.95%", status: "Elected" },
  { name: "Chorus One", group: "Chorus One", votingPower: "8.7M", uptime: "99.99%", status: "Elected" },
  { name: "Polychain Labs", group: "Polychain", votingPower: "7.2M", uptime: "99.91%", status: "Elected" },
  { name: "Stakin", group: "Stakin", votingPower: "6.5M", uptime: "99.96%", status: "Elected" },
  { name: "Cryptium Labs", group: "Cryptium", votingPower: "5.8M", uptime: "99.93%", status: "Elected" },
  { name: "Staking Facilities", group: "SF", votingPower: "5.2M", uptime: "99.89%", status: "Elected" },
  { name: "P2P Validator", group: "P2P", votingPower: "4.9M", uptime: "99.94%", status: "Elected" },
  { name: "Tessellated Geometry", group: "TG", votingPower: "3.7M", uptime: "99.87%", status: "Standby" },
  { name: "Nodes.Guru", group: "Guru", votingPower: "3.1M", uptime: "99.82%", status: "Standby" },
];

export type Proposal = {
  id: string;
  title: string;
  request: string;
  status: "Em votação" | "Revisão" | "Aprovada" | "Rascunho";
  category: string;
  url: string;
};

export const proposals: Proposal[] = [
  { id: "CGP-198", title: "Refill Community Fund Q1 2026", request: "5.000.000 CELO", status: "Em votação", category: "Tesouro", url: "https://mondo.celo.org/governance" },
  { id: "CGP-199", title: "MiniPay Grants Program — Cohort 4", request: "1.200.000 CELO", status: "Em votação", category: "Ecossistema", url: "https://mondo.celo.org/governance" },
  { id: "CGP-200", title: "Proof of Ship — Recompensas Trimestrais", request: "800.000 CELO", status: "Revisão", category: "Builders", url: "https://mondo.celo.org/governance" },
  { id: "CGP-201", title: "Real Use Case: Pagamentos África Subsaariana", request: "2.500.000 CELO", status: "Revisão", category: "Adoção", url: "https://mondo.celo.org/governance" },
  { id: "CGP-202", title: "Validator Rewards Adjustment", request: "Parâmetro", status: "Rascunho", category: "Rede", url: "https://mondo.celo.org/governance" },
];
