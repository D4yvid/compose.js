import { Composable } from "./compose.js";

type ConditionalProps = any;

export const Conditional = Composable<ConditionalProps>(self => {
    if (self.props) {
        return self.children?.at(0);
    }

    return undefined;
}, { hasChildren: true });
