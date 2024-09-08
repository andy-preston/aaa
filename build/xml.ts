import { type xml_node, type xml_text } from "@libs/xml";

export const attribute = (
    node: xml_node | xml_text,
    attributeName: string
): string =>
    ((node as xml_node)[`@${attributeName}`] as string).toLowerCase()
