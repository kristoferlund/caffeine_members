import Time "mo:base/Time";
import OrderedMap "mo:base/OrderedMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import O "mo:base/Order";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Debug "mo:base/Debug";

persistent actor {
    type Member = {
        name : Text;
        surname : Text;
        email : Text;
        createdDate : Time.Time;
        updatedDate : Time.Time;
    };

    type AddMemberResult = {
        #ok;
        #err : Text;
    };

    transient let memberMap = OrderedMap.Make<Text>(Text.compare);
    var members : OrderedMap.Map<Text, Member> = memberMap.empty();

    public func addMember(name : Text, surname : Text, email : Text) : async AddMemberResult {
        if (not isValidEmail(email)) {
            return #err("Invalid email address");
        };

        if (memberMap.get(members, email) != null) {
            return #err("Email address already exists");
        };

        let now = Time.now();
        let member : Member = {
            name = name;
            surname = surname;
            email = email;
            createdDate = now;
            updatedDate = now;
        };

        members := memberMap.put(members, email, member);
        return #ok;
    };

    public query func getMembers() : async [Member] {
        Iter.toArray(memberMap.vals(members));
    };

    func isValidEmail(email : Text) : Bool {
        let atIndex = indexOf(email, '@');
        let dotIndex = indexOf(email, '.');

        switch (atIndex, dotIndex) {
            case (?at, ?dot) {
                return at > 0 and dot > at + 1 and dot < Text.size(email) - 1;
            };
            case _ { return false };
        };
    };

    func indexOf(text : Text, char : Char) : ?Nat {
        var index = 0;
        for (c in text.chars()) {
            if (c == char) {
                return ?index;
            };
            index += 1;
        };
        return null;
    };
};

