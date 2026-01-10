import {
    type CircuitContext,
    constructorContext,
    QueryContext,
    sampleContractAddress,
} from "@midnight-ntwrk/compact-runtime";
import {
    Contract,
    type Ledger,
    ledger,
} from "../managed/patient-registry/contract/index.cjs";
import { type PatientRegistryPrivateState, witnesses } from "../witnesses.js";

/**
 * Patient Registryコントラクトのシミュレータークラス
 * テスト環境でコントラクトの動作を検証するために使用
 */
export class PatientRegistrySimulator {
  readonly contract: Contract<PatientRegistryPrivateState>;
  circuitContext: CircuitContext<PatientRegistryPrivateState>;

  constructor() {
    this.contract = new Contract<PatientRegistryPrivateState>(witnesses);
    const {
      currentPrivateState,
      currentContractState,
      currentZswapLocalState,
    } = this.contract.initialState(constructorContext({}, "0".repeat(64)));
    this.circuitContext = {
      currentPrivateState,
      currentZswapLocalState,
      originalState: currentContractState,
      transactionContext: new QueryContext(
        currentContractState.data,
        sampleContractAddress(),
      ),
    };
  }

  /**
   * 現在のレジャー状態を取得
   */
  public getLedger(): Ledger {
    return ledger(this.circuitContext.transactionContext.state);
  }

  /**
   * 現在のプライベート状態を取得
   */
  public getPrivateState(): PatientRegistryPrivateState {
    return this.circuitContext.currentPrivateState;
  }

  /**
   * 患者を登録
   * @param age 年齢
   * @param genderCode 性別コード（0=男性, 1=女性, 2=その他）
   * @param conditionHash 症例データのハッシュ値
   * @returns 更新後のレジャー状態
   */
  public registerPatient(
    age: bigint,
    genderCode: bigint,
    conditionHash: bigint,
  ): Ledger {
    // コントラクトのregisterPatientメソッドを追加
    const result = this.contract.impureCircuits.registerPatient(
      this.circuitContext,
      age,
      genderCode,
      conditionHash,
    );
    this.circuitContext = result.context;
    return ledger(this.circuitContext.transactionContext.state);
  }

  /**
   * 登録統計情報を取得
   * @returns [総登録数, 男性数, 女性数, その他数]
   */
  public getRegistrationStats(): [bigint, bigint, bigint, bigint] {
    // ledgerから直接統計情報を取得
    const ledgerState = this.getLedger();
    return [
      ledgerState.registrationCount,
      ledgerState.maleCount,
      ledgerState.femaleCount,
      ledgerState.otherCount,
    ];
  }

  /**
   * 年齢範囲を検証
   * @param age 検証対象の年齢
   * @param minAge 最小年齢
   * @param maxAge 最大年齢
   * @returns 範囲内の場合true
   */
  public verifyAgeRange(age: bigint, minAge: bigint, maxAge: bigint): boolean {
    // verifyAgeRangeもpure circuitなのでcircuitsから呼び出す
    const result = this.contract.circuits.verifyAgeRange(
      this.circuitContext,
      age,
      minAge,
      maxAge,
    );
    this.circuitContext = result.context;
    return result.result;
  }
}
