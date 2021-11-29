<script lang="ts">
  import InstructionAdder from "../components/InstructionAdder.svelte";
  import LoggedInFrame from "../../common/LoggedInFrame.svelte";
  import ContentBox from "../components/ContentBox.svelte";
  import {
    Grid,
    Row,
    Column,
    ButtonSet,
    Button,
    Modal,
    TextInput,
    Select,
    SelectItem,
    ContentSwitcher,
    Switch,
    FileUploaderDropContainer,
  } from "carbon-components-svelte";

  let open = false;
  let selectedIndex = 1;
</script>

<LoggedInFrame>
  <Grid>
    <Row>
      <ButtonSet class="right-button">
        <Button on:click={() => (open = true)}>템플릿 불러오기</Button>
        <Button kind="secondary" on:click={() => (open = true)}>생성</Button>
      </ButtonSet>
      <Modal
        passiveModal
        bind:open
        modalHeading="템플릿 불러오기"
        on:open
        on:close
      >
        <p>Create a new Cloudant database in the US South region.</p>
      </Modal>
    </Row>

    <ContentBox>
      <h3>재고 정보</h3>
      <Row>
        <Column>
          <TextInput
            labelText={"신규 사이즈 등록"}
            placeholder="작성 후 추가 버튼을 누르세요"
          />
          <Button kind="secondary" on:click={() => {}}>추가</Button>
        </Column>
      </Row>
    </ContentBox>

    <ContentBox>
      <h3>판매 정보</h3>
      <Row>
        <Column>
          <ContentSwitcher bind:selectedIndex>
            <Switch text="Latest news" />
            <Switch text="Recommended" />
          </ContentSwitcher>
          <InstructionAdder
            instructionTitle={"hello2"}
            instructions={["개", "내대", "래매배"]}
          />
        </Column>
        <Column>
          <h4>하자 정보</h4>
          <FileUploaderDropContainer
            labelText="여기에 파일을 드래그하거나 이곳을 클릭해서 파일을 선택하세요."
          />
          <TextInput placeholder="작성 후 추가 버튼을 누르세요" />
          <Button kind="secondary" on:click={() => {}}>추가</Button>
        </Column>
      </Row>
    </ContentBox>

    <ContentBox>
      <h3>상품 정보</h3>
      <Row>
        <Column>
          <Select labelText="브랜드 키네임">
            <SelectItem value="구호" text="구호" />
            <SelectItem value="VOV" text="VOV" />
          </Select>
          <TextInput labelText={"기존 가격"} />
        </Column>
        <Column>
          <TextInput labelText={"상품명"} />
          <TextInput labelText={"할인된 가격 (할인율:" + 15 + "%)"} />
        </Column>
      </Row>
      <FileUploaderDropContainer
        labelText="여기에 파일을 드래그하거나 이곳을 클릭해서 파일을 선택하시라요"
        multiple
      />
      <Row>
        <Column>
          <InstructionAdder
            instructionTitle={"hello1"}
            instructions={["가", "나다", "라마바"]}
          />
        </Column>
        <Column>
          <InstructionAdder
            instructionTitle={"hello2"}
            instructions={["개", "내대", "래매배"]}
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <InstructionAdder
            instructionTitle={"hello3"}
            instructions={["가", "나다", "라마바"]}
          />
        </Column>
        <Column>
          <InstructionAdder
            instructionTitle={"hello4"}
            instructions={["개", "내대", "래매배"]}
          />
        </Column>
      </Row>
    </ContentBox>
  </Grid>
</LoggedInFrame>

<style>
  :global(.right-button) {
    margin-left: 1rem;
  }
</style>
