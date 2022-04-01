/* Copyright 2020 Palantir Technologies, Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.*/

import * as React from "react";

import { Button, Code, H5, Icon, Switch } from "@blueprintjs/core";
import { Example, handleBooleanChange, IExampleProps } from "@blueprintjs/docs-theme";

export interface IButtonsGExampleState {
    active: boolean;
    disabled: boolean;
}

export class ButtonsGExample extends React.PureComponent<IExampleProps, IButtonsGExampleState> {
    public state: IButtonsGExampleState = {
        active: false,
        disabled: false,
    };

    private handleActiveChange = handleBooleanChange(active => this.setState({ active }));

    private handleDisabledChange = handleBooleanChange(disabled => this.setState({ disabled }));

    public render() {
        const { ...buttonProps } = this.state;

        const options = (
            <>
                <H5>Props</H5>
                <Switch label="Active" checked={this.state.active} onChange={this.handleActiveChange} />
                <Switch label="Disabled" checked={this.state.disabled} onChange={this.handleDisabledChange} />
            </>
        );

        return (
            <>
                <Example options={options} {...this.props}>
                    <H5>Primary</H5>
                    <div>
                        <p>
                            <Code>{`<Button large={true} icon="g-arrow-right" intent="primary" text="Continue" />`}</Code>
                        </p>
                        <Button
                            active={this.state.active}
                            disabled={this.state.disabled}
                            large={true}
                            icon="g-arrow-right"
                            intent="primary"
                            text="Continue"
                            {...buttonProps}
                        />
                        <p>
                            <Code>
                                {`<Button large={true} rightIcon="g-arrow-right" intent="primary" text="Continue" />`}{" "}
                            </Code>
                        </p>
                        <Button
                            active={this.state.active}
                            disabled={this.state.disabled}
                            large={true}
                            rightIcon="g-arrow-right"
                            intent="primary"
                            text="Continue"
                            {...buttonProps}
                        />
                        <p>
                            <Code>{`<Button large={true} intent="primary" text="Continue" />`}</Code>
                        </p>
                        <Button
                            active={this.state.active}
                            disabled={this.state.disabled}
                            large={true}
                            intent="primary"
                            text="Continue"
                            {...buttonProps}
                        />
                        <p>
                            <Code>{`<Button large={true} intent="primary" icon="g-arrow-right" />`}</Code>
                        </p>
                        <Button
                            active={this.state.active}
                            disabled={this.state.disabled}
                            large={true}
                            intent="primary"
                            icon="g-arrow-right"
                            {...buttonProps}
                        />
                    </div>
                    <div>
                        <p>
                            <Code>{`<Button icon="g-arrow-right" intent="primary" text="Continue" />`}</Code>
                        </p>
                        <Button
                            active={this.state.active}
                            disabled={this.state.disabled}
                            icon="g-arrow-right"
                            intent="primary"
                            text="Continue"
                            {...buttonProps}
                        />
                        <p>
                            <Code>{`<Button rightIcon="g-arrow-right" intent="primary" text="Continue" />`}</Code>
                        </p>
                        <Button
                            active={this.state.active}
                            disabled={this.state.disabled}
                            rightIcon="g-arrow-right"
                            intent="primary"
                            text="Continue"
                            {...buttonProps}
                        />
                        <p>
                            <Code>{`<Button text="Continue" intent="primary" />`}</Code>
                        </p>
                        <Button
                            active={this.state.active}
                            disabled={this.state.disabled}
                            text="Continue"
                            intent="primary"
                            {...buttonProps}
                        />
                        <p>
                            <Code>{`<Button icon="g-arrow-right" intent="primary" />`}</Code>
                        </p>
                        <Button
                            active={this.state.active}
                            disabled={this.state.disabled}
                            icon="g-arrow-right"
                            intent="primary"
                            {...buttonProps}
                        />
                    </div>
                </Example>
                <Example options={options} {...this.props}>
                    <H5>Secondary</H5>
                    <div>
                        <p>
                            <Code>{`<Button large={true} icon={<Icon intent="primary" icon="g-arrow-right" />} text="Continue" />`}</Code>
                        </p>
                        <Button
                            active={this.state.active}
                            disabled={this.state.disabled}
                            large={true}
                            icon={<Icon intent="primary" icon="g-arrow-right" />}
                            text="Continue"
                            {...buttonProps}
                        />
                        <p>
                            <Code>{`<Button large={true} rightIcon={<Icon intent="primary" icon="g-arrow-right" />} text="Continue" />`}</Code>
                        </p>
                        <Button
                            active={this.state.active}
                            disabled={this.state.disabled}
                            large={true}
                            rightIcon={<Icon intent="primary" icon="g-arrow-right" />}
                            text="Continue"
                            {...buttonProps}
                        />
                        <p>
                            <Code>{`<Button large={true} text="Continue" />`}</Code>
                        </p>
                        <Button
                            active={this.state.active}
                            disabled={this.state.disabled}
                            large={true}
                            text="Continue"
                            {...buttonProps}
                        />
                        <p>
                            <Code>{`<Button large={true} icon={<Icon intent="primary" icon="g-arrow-right" />} />`}</Code>
                        </p>
                        <Button
                            active={this.state.active}
                            disabled={this.state.disabled}
                            large={true}
                            icon={<Icon intent="primary" icon="g-arrow-right" />}
                            {...buttonProps}
                        />
                    </div>
                    <div>
                        <p>
                            <Code>{`<Button icon={<Icon intent="primary" icon="g-arrow-right" />} text="Continue" />`}</Code>
                        </p>
                        <Button
                            active={this.state.active}
                            disabled={this.state.disabled}
                            icon={<Icon intent="primary" icon="g-arrow-right" />}
                            text="Continue"
                            {...buttonProps}
                        />
                        <p>
                            <Code>{`<Button rightIcon={<Icon intent="primary" icon="g-arrow-right" />} text="Continue" />`}</Code>
                        </p>
                        <Button
                            active={this.state.active}
                            disabled={this.state.disabled}
                            rightIcon={<Icon intent="primary" icon="g-arrow-right" />}
                            text="Continue"
                            {...buttonProps}
                        />
                        <p>
                            <Code>{`<Button text="Continue" />`}</Code>
                        </p>
                        <Button active={this.state.active} disabled={this.state.disabled} text="Continue" />
                        <p>
                            <Code>{`<Button active={this.state.active} disabled={this.state.disabled} icon={<Icon intent="primary" icon="g-arrow-right" />} />`}</Code>
                        </p>
                        <Button
                            active={this.state.active}
                            disabled={this.state.disabled}
                            icon={<Icon intent="primary" icon="g-arrow-right" />}
                            {...buttonProps}
                        />
                    </div>
                </Example>
                <Example options={options} {...this.props}>
                    <H5>Stroke</H5>
                    <div>
                        <p>
                            <Code>{`<Button outlined={true} large={true} icon="g-arrow-right" text="Continue" />`}</Code>
                        </p>
                        <Button
                            active={this.state.active}
                            disabled={this.state.disabled}
                            outlined={true}
                            large={true}
                            icon="g-arrow-right"
                            text="Continue"
                            {...buttonProps}
                        />
                        <p>
                            <Code>
                                {`<Button outlined={true} large={true} rightIcon="g-arrow-right" text="Continue" />`}{" "}
                            </Code>
                        </p>
                        <Button
                            active={this.state.active}
                            disabled={this.state.disabled}
                            outlined={true}
                            large={true}
                            rightIcon="g-arrow-right"
                            text="Continue"
                            {...buttonProps}
                        />
                        <p>
                            <Code>{`<Button outlined={true} large={true} text="Continue" />`}</Code>
                        </p>
                        <Button
                            active={this.state.active}
                            disabled={this.state.disabled}
                            outlined={true}
                            large={true}
                            text="Continue"
                            {...buttonProps}
                        />
                        <p>
                            <Code>{`<Button outlined={true} large={true} icon="g-arrow-right" />`}</Code>
                        </p>
                        <Button
                            active={this.state.active}
                            disabled={this.state.disabled}
                            outlined={true}
                            large={true}
                            icon="g-arrow-right"
                            {...buttonProps}
                        />
                    </div>
                    <div>
                        <p>
                            <Code>{`<Button outlined={true} icon="g-arrow-right" text="Continue" />`}</Code>
                        </p>
                        <Button
                            active={this.state.active}
                            disabled={this.state.disabled}
                            outlined={true}
                            icon="g-arrow-right"
                            text="Continue"
                            {...buttonProps}
                        />
                        <p>
                            <Code>{`<Button outlined={true} rightIcon="g-arrow-right" text="Continue" />`}</Code>
                        </p>
                        <Button
                            active={this.state.active}
                            disabled={this.state.disabled}
                            outlined={true}
                            rightIcon="g-arrow-right"
                            text="Continue"
                            {...buttonProps}
                        />
                        <p>
                            <Code>{`<Button outlined={true} text="Continue" />`}</Code>
                        </p>
                        <Button
                            active={this.state.active}
                            disabled={this.state.disabled}
                            outlined={true}
                            text="Continue"
                            {...buttonProps}
                        />
                        <p>
                            <Code>{`<Button outlined={true} icon="g-arrow-right" />`}</Code>
                        </p>
                        <Button
                            active={this.state.active}
                            disabled={this.state.disabled}
                            outlined={true}
                            icon="g-arrow-right"
                            {...buttonProps}
                        />
                    </div>
                </Example>
                <Example options={options} {...this.props}>
                    <H5>Ghost</H5>
                    <div>
                        <p>
                            <Code>{`<Button minimal={true} intent="primary" large={true} icon="g-arrow-right" text="Continue" />`}</Code>
                        </p>
                        <Button
                            active={this.state.active}
                            disabled={this.state.disabled}
                            minimal={true}
                            intent="primary"
                            large={true}
                            icon="g-arrow-right"
                            text="Continue"
                            {...buttonProps}
                        />
                        <p>
                            <Code>
                                {`<Button minimal={true} intent="primary" large={true} rightIcon="g-arrow-right" text="Continue" />`}{" "}
                            </Code>
                        </p>
                        <Button
                            active={this.state.active}
                            disabled={this.state.disabled}
                            minimal={true}
                            intent="primary"
                            large={true}
                            rightIcon="g-arrow-right"
                            text="Continue"
                            {...buttonProps}
                        />
                        <p>
                            <Code>{`<Button minimal={true} intent="primary" large={true} text="Continue" />`}</Code>
                        </p>
                        <Button
                            active={this.state.active}
                            disabled={this.state.disabled}
                            minimal={true}
                            intent="primary"
                            large={true}
                            text="Continue"
                            {...buttonProps}
                        />
                        <p>
                            <Code>{`<Button minimal={true} intent="primary" large={true} icon="g-arrow-right" />`}</Code>
                        </p>
                        <Button
                            active={this.state.active}
                            disabled={this.state.disabled}
                            minimal={true}
                            intent="primary"
                            large={true}
                            icon="g-arrow-right"
                            {...buttonProps}
                        />
                    </div>
                    <div>
                        <p>
                            <Code>{`<Button minimal={true} intent="primary" icon="g-arrow-right" text="Continue" />`}</Code>
                        </p>
                        <Button
                            active={this.state.active}
                            disabled={this.state.disabled}
                            minimal={true}
                            intent="primary"
                            icon="g-arrow-right"
                            text="Continue"
                            {...buttonProps}
                        />
                        <p>
                            <Code>{`<Button minimal={true} intent="primary" rightIcon="g-arrow-right" text="Continue" />`}</Code>
                        </p>
                        <Button
                            active={this.state.active}
                            disabled={this.state.disabled}
                            minimal={true}
                            intent="primary"
                            rightIcon="g-arrow-right"
                            text="Continue"
                            {...buttonProps}
                        />
                        <p>
                            <Code>{`<Button minimal={true} intent="primary" text="Continue" />`}</Code>
                        </p>
                        <Button
                            active={this.state.active}
                            disabled={this.state.disabled}
                            minimal={true}
                            intent="primary"
                            text="Continue"
                            {...buttonProps}
                        />
                        <p>
                            <Code>{`<Button minimal={true} intent="primary" icon="g-arrow-right" />`}</Code>
                        </p>
                        <Button
                            active={this.state.active}
                            disabled={this.state.disabled}
                            minimal={true}
                            intent="primary"
                            icon="g-arrow-right"
                            {...buttonProps}
                        />
                    </div>
                </Example>
            </>
        );
    }
}
